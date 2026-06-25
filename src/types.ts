/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "guest" | "patient" | "coach";

export type PainZone = 
  | "shoulder" 
  | "knee" 
  | "lower_back" 
  | "ankle" 
  | "neck" 
  | "elbow" 
  | "hip";

export interface VASPainLog {
  id: string;
  date: string;
  intensity: number; // 0 (no pain) to 10 (worst pain imaginable)
  zone: PainZone;
  notes?: string;
}

export interface PatientExercise {
  id: string;
  name: string;
  reps: string;
  sets: number;
  completed: boolean;
  progress?: number; // 0 to 100
  videoUrl?: string; // Standardized video/animation instructions placeholder
  description: string;
}

export interface CheckIn {
  date: string;
  mood: number; // 1 to 5
  sleep: number; // 1 to 5
}

export interface ClientRecord {
  id: string;
  name: string;
  fullName?: string;
  phone: string;
  email: string;
  age: number;
  sport: string;
  injury: string;
  injuryZone: PainZone;
  selectedZone?: PainZone;
  joinDate: string;
  sessionsPurchased: number;
  sessionsCompleted: number;
  initialPainLevel: number;
  currentPainLevel: number;
  painHistory: { date: string; intensity: number }[];
  checkIns?: CheckIn[];
  prescription: PatientExercise[];
  notes: string;
  completedSessionsLog: { date: string; completedExercisesCount: number; notes: string }[];
}

export interface AssessmentSubmission {
  fullName: string;
  phone: string;
  age: number;
  sport: string;
  selectedZone: PainZone;
  painIntensity: number;
  history: string;
  goals: string;
  mediaFiles?: File[];
}
