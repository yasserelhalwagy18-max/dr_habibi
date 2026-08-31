import pino from 'pino';

// Define paths to redact based on Prisma schema analysis and common sensitive keys
const redactPaths = [
  // Auth/Session
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-access-token"]',
  '*.password',
  '*.passwordHash',
  '*.token',
  '*.jwt',

  // PII
  '*.email',
  '*.nationalId',
  '*.phone',
  '*.phoneNumber',
  '*.dateOfBirth',

  // Clinical / Health Data (PatientProfile, PainLog, AssessmentForm, ProgressCheckIn, SessionReport)
  '*.medicalHistory',
  '*.notes',
  '*.painLevel',
  '*.bodyLocation',
  '*.painLocation',
  '*.painIntensity',
  '*.history',
  '*.goals',
  '*.sleepQuality',
  '*.energyLevel',
  '*.clinicalNotes',
  '*.patientFeedback',
  '*.nextSteps',

  // Files / S3 URLs
  '*.mediaUrls',
  '*.attachmentUrl',
  '*.videoUrl',
  '*.aparatHash'
];

// Configure Pino
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});
