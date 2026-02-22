// User progress state management with localStorage persistence
import { UserProfile, UserProgressState, UserProgress, Achievement } from '../types';

// Storage keys
const STORAGE_KEYS = {
  PROFILE: 'dialect-master-profile',
  PROGRESS: 'dialect-master-progress',
  ACHIEVEMENTS: 'dialect-master-achievements',
  WEEKLY: 'dialect-master-weekly',
};

// Default values
const DEFAULT_PROFILE: UserProfile = {
  id: '',
  name: '',
  selectedDialect: 'hokkien',
  dailyGoalMinutes: 10,
  level: 1,
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  createdAt: new Date().toISOString(),
};

const DEFAULT_PROGRESS: Record<string, UserProgress> = {};
const DEFAULT_ACHIEVEMENTS: Record<string, boolean> = {};

// XP thresholds per level
const XP_FOR_LEVEL = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000
];

export function getStoredProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getStoredProgress(): Record<string, UserProgress> | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveProgress(progress: Record<string, UserProgress>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function getStoredAchievements(): Record<string, boolean> | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveAchievements(achievements: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function getWeeklyActivity(): Record<string, number> | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveWeeklyActivity(activity: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.WEEKLY, JSON.stringify(activity));
}

// XP and Level functions
export function calculateLevel(xp: number): number {
  for (let i = XP_FOR_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_FOR_LEVEL[i]) return i + 1;
  }
  return 1;
}

export function xpToNextLevel(level: number): number {
  if (level >= XP_FOR_LEVEL.length) return 0;
  return XP_FOR_LEVEL[level] - XP_FOR_LEVEL[level - 1];
}

export function xpProgressInLevel(xp: number, level: number): number {
  if (level === 1) {
    // For level 1, show progress toward level 2 (100 XP threshold)
    return Math.min((xp / XP_FOR_LEVEL[1]) * 100, 100);
  }
  const currentLevelXP = XP_FOR_LEVEL[level - 1];
  const nextLevelXP = XP_FOR_LEVEL[level];
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

// Streak functions
export function updateStreak(profile: UserProfile): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (!profile.lastStudyDate) {
    // First day
    return { ...profile, streak: 1, lastStudyDate: today };
  }
  
  if (profile.lastStudyDate === today) {
    // Already studied today
    return profile;
  }
  
  if (profile.lastStudyDate === yesterday) {
    // Continue streak
    return { ...profile, streak: profile.streak + 1, lastStudyDate: today };
  }
  
  // Streak broken
  return { ...profile, streak: 1, lastStudyDate: today };
}

// Progress tracking
export function markLessonComplete(
  lessonId: string,
  xpEarned: number,
  quizScore?: number
): { profile: UserProfile; progress: Record<string, UserProgress> } {
  const profile = getStoredProfile() || DEFAULT_PROFILE;
  const progress = getStoredProgress() || DEFAULT_PROGRESS;
  
  // Update profile
  const updatedProfile = {
    ...updateStreak({ ...profile, xp: profile.xp + xpEarned }),
    level: calculateLevel(profile.xp + xpEarned),
  };
  
  // Update lesson progress
  progress[lessonId] = {
    lessonId,
    completed: true,
    xpEarned,
    completedAt: new Date().toISOString(),
    quizScore,
  };
  
  saveProfile(updatedProfile);
  saveProgress(progress);
  
  return { profile: updatedProfile, progress: progress };
}

export function getLessonProgress(lessonId: string): UserProgress | undefined {
  const progress = getStoredProgress();
  return progress?.[lessonId];
}

export function getCompletedLessonsCount(dialect?: string): number {
  const progress = getStoredProgress();
  if (!progress) return 0;
  
  return Object.values(progress).filter(p => {
    if (!dialect) return true;
    // Could filter by dialect if needed
    return true;
  }).length;
}

export function getTotalXP(): number {
  const profile = getStoredProfile();
  return profile?.xp || 0;
}

// Reset for testing
export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  localStorage.removeItem(STORAGE_KEYS.WEEKLY);
}
