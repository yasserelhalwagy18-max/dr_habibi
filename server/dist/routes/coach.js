import express, {} from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../utils/authMiddleware.js';
const router = express.Router();
const prisma = new PrismaClient();
// GET /api/coach/patients
// Fetch assigned patients with their active packages and basic stats
router.get('/patients', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const coachProfile = await prisma.coachProfile.findUnique({
            where: { userId },
            include: {
                patients: {
                    include: {
                        user: true,
                        prescriptions: {
                            include: {
                                exercise: true,
                                submissions: true
                            }
                        },
                        progressCheckIns: {
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        },
                        painLogs: {
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        },
                        patientPackages: {
                            where: { status: 'ACTIVE' },
                            include: {
                                package: true,
                                sessions: {
                                    where: { status: 'COMPLETED' },
                                    include: { report: true },
                                    orderBy: { createdAt: 'desc' }
                                }
                            },
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        });
        if (!coachProfile) {
            res.status(404).json({ success: false, error: 'Coach profile not found' });
            return;
        }
        res.json({ success: true, data: coachProfile.patients });
    }
    catch (error) {
        console.error('Error fetching assigned patients:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// GET /api/coach/patients/:id/logs
// Fetch progress logs and pain history for a specific patient
router.get('/patients/:id/logs', authenticateJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const logs = await prisma.progressCheckIn.findMany({
            where: { patientProfileId: id },
            orderBy: { createdAt: 'desc' }
        });
        const painHistory = await prisma.painLog.findMany({
            where: { patientProfileId: id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: { logs, painHistory } });
    }
    catch (error) {
        console.error('Error fetching patient logs:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// GET /api/coach/patients/:id/videos
// Fetch ExerciseSubmission videos for the patient
router.get('/patients/:id/videos', authenticateJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const submissions = await prisma.exerciseSubmission.findMany({
            where: {
                prescription: {
                    patientProfileId: id
                }
            },
            include: {
                prescription: {
                    include: {
                        exercise: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: submissions });
    }
    catch (error) {
        console.error('Error fetching patient videos:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// POST /api/coach/sessions/:id/report
// Create a SessionReport, mark Session as COMPLETED, decrement remainingSessions, calculate commission
router.post('/sessions/:id/report', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const id = req.params.id; // Session ID
        const { date, clinicalNotes, patientFeedback, nextSteps } = req.body;
        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                coachProfile: true,
                patientPackage: {
                    include: { package: true }
                }
            }
        });
        if (!session) {
            res.status(404).json({ success: false, error: 'Session not found' });
            return;
        }
        if (session.coachProfile.userId !== userId) {
            res.status(403).json({ success: false, error: 'Forbidden' });
            return;
        }
        const reportDate = date ? new Date(date) : new Date();
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create SessionReport
            const report = await tx.sessionReport.create({
                data: {
                    sessionId: id,
                    date: reportDate,
                    clinicalNotes,
                    patientFeedback,
                    nextSteps
                }
            });
            // 2. Mark Session as COMPLETED
            await tx.session.update({
                where: { id },
                data: { status: 'COMPLETED' }
            });
            // 3. Decrement remainingSessions in PatientPackage
            const updatedPackage = await tx.patientPackage.update({
                where: { id: session.patientPackage.id },
                data: {
                    remainingSessions: {
                        decrement: 1
                    }
                }
            });
            // Complete package if 0 sessions left
            if (updatedPackage.remainingSessions <= 0) {
                await tx.patientPackage.update({
                    where: { id: session.patientPackage.id },
                    data: { status: 'COMPLETED' }
                });
            }
            // 4. Calculate commission (e.g., 60% of package price / number of sessions)
            const packagePrice = session.patientPackage.package.price;
            const totalSessions = session.patientPackage.package.numberOfSessions;
            const commissionRate = 0.60; // 60% fixed as per requirements
            const commissionAmountPerSession = (packagePrice * commissionRate) / totalSessions;
            // Log commission in Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId: userId, // Coach user ID receiving the commission
                    patientPackageId: session.patientPackage.id,
                    sessionId: id,
                    amount: commissionAmountPerSession, // This is the commission earned for this session
                    type: 'PACKAGE', // Or 'COMMISSION' if added to enum
                    status: 'SUCCESS'
                }
            });
            return { report, transaction };
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error submitting session report:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// GET /api/coach/finances
// Fetch the coach's calculated commissions and income history
router.get('/finances', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        // Since we store commission payouts as transactions linked to the coach's userId
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId,
                sessionId: { not: null }, // Commission from sessions
                status: 'SUCCESS'
            },
            include: {
                session: {
                    include: {
                        patientPackage: {
                            include: { patientProfile: { include: { user: true } } }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        res.json({ success: true, data: { totalIncome, transactions } });
    }
    catch (error) {
        console.error('Error fetching coach finances:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// POST /api/coach/mock-session
// Mock endpoint to easily create a pending session for testing purposes
router.post('/mock-session', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const { patientProfileId } = req.body;
        const coachProfile = await prisma.coachProfile.findUnique({ where: { userId } });
        if (!coachProfile) {
            res.status(404).json({ success: false, error: 'Coach profile not found' });
            return;
        }
        const patientPackage = await prisma.patientPackage.findFirst({
            where: { patientProfileId, status: 'ACTIVE' }
        });
        if (!patientPackage) {
            res.status(404).json({ success: false, error: 'Patient package not found' });
            return;
        }
        const session = await prisma.session.create({
            data: {
                patientPackageId: patientPackage.id,
                coachProfileId: coachProfile.id,
                scheduledAt: new Date(),
                status: 'SCHEDULED'
            }
        });
        res.json({ success: true, data: session });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error' });
    }
});
export default router;
//# sourceMappingURL=coach.js.map