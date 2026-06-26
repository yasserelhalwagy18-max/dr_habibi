import express, { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, type AuthRequest } from '../utils/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/chat/users
// Fetch the list of users this user can chat with.
// For Coach: their assigned patients.
// For Patient: their assigned coach.
router.get('/users', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ success: false, error: 'Unauthorized' });
       return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        coachProfile: {
          include: {
            patients: {
              include: { user: true }
            }
          }
        },
        patientProfile: {
          include: {
            assignedCoach: {
              include: { user: true }
            }
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const chatUsers = [];

    if (user.role === 'COACH' && user.coachProfile) {
      for (const patient of user.coachProfile.patients) {
        chatUsers.push({
          id: patient.user.id,
          name: patient.user.name,
          role: 'PATIENT',
          avatarUrl: null // Add avatar logic if needed
        });
      }
    } else if (user.role === 'PATIENT' && user.patientProfile?.assignedCoach) {
      chatUsers.push({
        id: user.patientProfile.assignedCoach.user.id,
        name: user.patientProfile.assignedCoach.user.name,
        role: 'COACH',
        avatarUrl: null
      });
    }

    res.json({ success: true, data: chatUsers });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/chat/messages/:targetUserId
// Fetch chat history between the authenticated user and targetUserId
router.get('/messages/:targetUserId', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const targetUserId = req.params.targetUserId as string;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' } // Oldest to newest for chat flow
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
