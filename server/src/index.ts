import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { uploadToS3 } from './utils/s3.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Set up Multer to handle multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

// Endpoint to handle Patient Assessment Form submission
app.post('/api/assessments', upload.array('mediaFiles'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      age,
      sport,
      selectedZone,
      painIntensity,
      history,
      goals,
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const mediaUrls: string[] = [];

    // Upload files to S3 if they exist
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadToS3(file.buffer, file.mimetype, file.originalname);
        mediaUrls.push(url);
      }
    }

    // Save to Prisma AssessmentForm model
    const assessment = await prisma.assessmentForm.create({
      data: {
        fullName,
        phone,
        age: parseInt(age, 10),
        sport,
        selectedZone,
        painIntensity: parseInt(painIntensity, 10),
        history,
        goals,
        mediaUrls,
      },
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
