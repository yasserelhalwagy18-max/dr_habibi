import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-for-dev';

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body; // Very simple mockup login for this task

    // Find patient for the email (assuming patient for this context)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patientProfile: true
      }
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    const payload = {
      id: user.id,
      role: user.role,
      patientProfileId: user.patientProfile?.id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
