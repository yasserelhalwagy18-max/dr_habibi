import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Read package.json once at startup to avoid blocking IO on every request
let version = 'unknown';
try {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  version = packageJson.version || 'unknown';
} catch (error) {
  // Silent fallback
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
  let dbStatus = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    version,
    database: dbStatus,
  });
});

export default router;
