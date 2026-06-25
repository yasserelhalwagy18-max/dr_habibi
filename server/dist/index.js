import express, {} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { uploadToS3 } from './utils/s3.js';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import paymentRoutes from './routes/payment.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import coachRoutes from './routes/coach.js';
import chatRoutes from './routes/chat.js';
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // In production, replace with actual frontend URL
        methods: ['GET', 'POST']
    }
});
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
// Set up Multer to handle multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/chat', chatRoutes);
// Socket.io for Real-time Chat
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // User joins their own personal room (using their userId) to receive direct messages
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room.`);
    });
    // Handle sending a message
    socket.on('sendMessage', async (data) => {
        try {
            // 1. Save to DB
            const message = await prisma.message.create({
                data: {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    content: data.content,
                }
            });
            // 2. Broadcast to receiver (if online) and back to sender (to confirm sent)
            io.to(data.receiverId).emit('newMessage', message);
            io.to(data.senderId).emit('newMessage', message);
        }
        catch (error) {
            console.error('Error saving/sending message via socket:', error);
        }
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
// Endpoint to handle Patient Assessment Form submission
app.post('/api/assessments', upload.array('mediaFiles'), async (req, res) => {
    try {
        const { fullName, phone, age, gender, sport, selectedZone, painIntensity, history, goals, } = req.body;
        const parsedAge = parseInt(age, 10);
        const parsedGender = gender;
        const files = req.files;
        const mediaUrls = [];
        // Upload files to S3 if they exist
        if (files && files.length > 0) {
            for (const file of files) {
                const url = await uploadToS3(file.buffer, file.mimetype, file.originalname);
                mediaUrls.push(url);
            }
        }
        // Find a coach based on rules:
        // Children < 12 -> Female Coach
        // Male -> Male Coach
        // Female -> Female Coach
        let targetCoachGender = parsedGender;
        if (parsedAge < 12) {
            targetCoachGender = 'FEMALE';
        }
        // Attempt to find an approved coach matching the criteria
        const availableCoach = await prisma.coachProfile.findFirst({
            where: {
                isApproved: true,
                user: {
                    gender: targetCoachGender
                }
            },
            include: {
                user: true
            }
        });
        let assignedCoachId = null;
        if (availableCoach) {
            assignedCoachId = availableCoach.id;
        }
        else {
            console.warn(`No available ${targetCoachGender} coach found for patient assignment.`);
        }
        // Create User, PatientProfile, and AssessmentForm in a transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email: `${phone}@temp.com`, // Temporary email generation or rely on auth flow
                    passwordHash: 'temp-hash', // Temporary password
                    name: fullName,
                    role: 'PATIENT',
                    gender: parsedGender,
                }
            });
            // 2. Create PatientProfile
            const patientProfile = await tx.patientProfile.create({
                data: {
                    userId: user.id,
                    gender: parsedGender,
                    assignedCoachId,
                }
            });
            // 3. Create AssessmentForm
            const assessment = await tx.assessmentForm.create({
                data: {
                    fullName,
                    phone,
                    age: parsedAge,
                    gender: parsedGender,
                    sport,
                    selectedZone,
                    painIntensity: parseInt(painIntensity, 10),
                    history,
                    goals,
                    mediaUrls,
                    patientProfileId: patientProfile.id,
                },
            });
            return { user, patientProfile, assessment };
        });
        res.status(201).json({ success: true, data: transactionResult.assessment });
    }
    catch (error) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// --- Admin Endpoints ---
// Get Financial Reports
app.get('/api/admin/finances', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                patientPackage: {
                    include: {
                        patientProfile: {
                            include: { user: true }
                        },
                        package: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        let totalRevenue = 0;
        let totalCommission = 0;
        const formattedTransactions = transactions.map(t => {
            totalRevenue += t.amount;
            const comm = t.commissionAmount || 0;
            totalCommission += comm;
            return {
                id: t.id,
                userName: t.patientPackage?.patientProfile?.user?.name || 'Unknown',
                packageType: t.patientPackage?.package?.name || t.type,
                amount: t.amount,
                date: t.createdAt,
                status: t.zarinpalRefId ? 'COMPLETED' : 'PENDING'
            };
        });
        const totalPayouts = totalRevenue - totalCommission;
        res.json({
            success: true,
            data: {
                kpi: {
                    totalRevenue,
                    totalCommission,
                    totalPayouts,
                },
                recentTransactions: formattedTransactions
            }
        });
    }
    catch (error) {
        console.error('Error fetching finances:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Get All Users
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Get Coaches Pending Approval
app.get('/api/admin/coaches/pending', async (req, res) => {
    try {
        const pendingCoaches = await prisma.coachProfile.findMany({
            where: { isApproved: false },
            include: { user: true }
        });
        res.json({ success: true, data: pendingCoaches });
    }
    catch (error) {
        console.error('Error fetching pending coaches:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Approve a Coach
app.patch('/api/admin/coaches/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const coachId = typeof id === 'string' ? id : '';
        const updatedCoach = await prisma.coachProfile.update({
            where: { id: coachId },
            data: { isApproved: true }
        });
        res.json({ success: true, data: updatedCoach });
    }
    catch (error) {
        console.error('Error approving coach:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Create a Platform Notification
app.post('/api/admin/notifications', async (req, res) => {
    try {
        const { title, content, type, userId } = req.body;
        const notification = await prisma.notification.create({
            data: {
                title,
                content,
                type: type || 'SYSTEM',
                userId: userId || null
            }
        });
        res.status(201).json({ success: true, data: notification });
    }
    catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map