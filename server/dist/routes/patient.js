import express, {} from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../utils/authMiddleware.js';
import multer from 'multer';
import { uploadToS3 } from '../utils/s3.js';
const router = express.Router();
const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage });
// GET /api/patient/dashboard
router.get('/dashboard', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId },
            include: {
                patientPackages: {
                    where: { status: 'ACTIVE' },
                    include: { package: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                prescriptions: {
                    include: {
                        exercise: true,
                        submissions: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                progressCheckIns: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                user: true,
                assignedCoach: {
                    include: { user: true }
                }
            }
        });
        if (!patientProfile) {
            res.status(404).json({ success: false, error: 'Patient profile not found' });
            return;
        }
        // Aggregating response data for dashboard
        const activePackage = patientProfile.patientPackages.length > 0 ? patientProfile.patientPackages[0] : null;
        const historyLogs = patientProfile.progressCheckIns;
        res.json({
            success: true,
            data: {
                profile: {
                    id: patientProfile.id,
                    name: patientProfile.user.name,
                    coachName: patientProfile.assignedCoach?.user?.name
                },
                activePackage: activePackage ? {
                    name: activePackage.package.name,
                    remainingSessions: activePackage.remainingSessions,
                    startDate: activePackage.startDate,
                    endDate: activePackage.endDate
                } : null,
                prescriptions: patientProfile.prescriptions,
                historyLogs
            }
        });
    }
    catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// POST /api/patient/prescriptions/:prescriptionId/submit
router.post('/prescriptions/:prescriptionId/submit', authenticateJWT, upload.single('video'), async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const { prescriptionId } = req.params;
        const rawNotes = req.body.notes;
        let notes = null;
        if (typeof rawNotes === 'string') {
            notes = rawNotes;
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ success: false, error: 'No video file provided' });
            return;
        }
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { patientProfile: true }
        });
        if (!prescription || prescription.patientProfile.userId !== userId) {
            res.status(403).json({ success: false, error: 'Forbidden' });
            return;
        }
        const videoUrl = await uploadToS3(file.buffer, file.mimetype, file.originalname);
        const submission = await prisma.exerciseSubmission.create({
            data: {
                prescriptionId,
                videoUrl,
                notes
            }
        });
        res.json({ success: true, data: submission });
    }
    catch (error) {
        console.error('Error submitting exercise:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
// POST /api/patient/checkin
router.post('/checkin', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const { painLevel, painLocation, notes, sleepQuality, energyLevel } = req.body;
        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId }
        });
        if (!patientProfile) {
            res.status(404).json({ success: false, error: 'Patient profile not found' });
            return;
        }
        const checkIn = await prisma.progressCheckIn.create({
            data: {
                patientProfileId: patientProfile.id,
                painLevel: parseInt(painLevel, 10),
                painLocation: typeof painLocation === 'string' ? painLocation : null,
                notes: typeof notes === 'string' ? notes : null,
                sleepQuality: parseInt(sleepQuality, 10),
                energyLevel: parseInt(energyLevel, 10)
            }
        });
        res.json({ success: true, data: checkIn });
    }
    catch (error) {
        console.error('Error creating check-in:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
export default router;
//# sourceMappingURL=patient.js.map