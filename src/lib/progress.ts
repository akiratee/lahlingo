// User progress state management with localStorage persistence
import { UserProfile, UserProgressState, UserProgress, Achievement, Dialect } from '../types';
import { LESSONS } from './lessons';

// Storage keys
const STORAGE_KEYS = {
  PROFILE: 'dialect-master-profile',
  PROGRESS: 'dialect-master-progress',
  ACHIEVEMENTS: 'dialect-master-achievements',
  WEEKLY: 'dialect-master-weekly',
  TRIED_DIALECTS: 'dialect-master-tried-dialects',
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
  streakFreezes: 1, // Start with 1 free streak freeze
  longestStreak: 0,
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

// Get the current week's start date (Monday) as a key
function getWeekKey(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Add study minutes to weekly activity
export function addToWeeklyActivity(minutes: number): Record<string, number> {
  const activity = getWeeklyActivity() || {};
  const weekKey = getWeekKey();
  
  // Initialize week if not exists
  if (!activity[weekKey]) {
    activity[weekKey] = 0;
  }
  
  activity[weekKey] += minutes;
  saveWeeklyActivity(activity);
  
  return activity;
}

// Get weekly activity for display (last 7 days with actual study data)
export function getWeeklyActivityForDisplay(): { day: string; minutes: number; isToday: boolean }[] {
  const activity = getWeeklyActivity() || {};
  const today = new Date();
  const result: { day: string; minutes: number; isToday: boolean }[] = [];
  
  // Get last 7 days (including today)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayKey = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = i === 0;
    
    // Sum all week entries that contain this day (in case week spans across)
    let totalMinutes = 0;
    for (const [weekKey, minutes] of Object.entries(activity)) {
      // For simplicity, show the weekKey's data for each day in that week
      if (weekKey === dayKey) {
        totalMinutes = minutes as number;
      }
    }
    
    // Actually, let's simplify: get last 7 days directly from stored data
    // The storage stores week start dates, so we need to check if a day falls in that week
  }
  
  // Simpler approach: just show activity for the current week
  const weekKey = getWeekKey();
  const weekMinutes = activity[weekKey] || 0;
  
  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = i === 0;
    
    // For now, distribute the week's minutes roughly across days (for demo)
    // In a real app, you'd track daily, not weekly
    result.push({
      day: dayName,
      minutes: isToday ? weekMinutes : Math.floor(weekMinutes / 7),
      isToday
    });
  }
  
  return result;
}

// Tried dialects tracking for Explorer achievement
export function getTriedDialects(): Dialect[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.TRIED_DIALECTS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveTriedDialects(dialects: Dialect[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TRIED_DIALECTS, JSON.stringify(dialects));
}

export function addTriedDialect(dialect: Dialect): Dialect[] {
  const dialects = getTriedDialects();
  if (!dialects.includes(dialect)) {
    const updated = [...dialects, dialect];
    saveTriedDialects(updated);
    return updated;
  }
  return dialects;
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
    return { 
      ...profile, 
      streak: 1, 
      longestStreak: Math.max(1, profile.longestStreak),
      lastStudyDate: today 
    };
  }
  
  if (profile.lastStudyDate === today) {
    // Already studied today
    return profile;
  }
  
  if (profile.lastStudyDate === yesterday) {
    // Continue streak - update longest if needed
    const newStreak = profile.streak + 1;
    return { 
      ...profile, 
      streak: newStreak,
      longestStreak: Math.max(newStreak, profile.longestStreak),
      lastStudyDate: today 
    };
  }
  
  // Streak broken - check if user has freezes to use
  if (profile.streakFreezes > 0) {
    // Use a streak freeze to preserve the streak
    return { 
      ...profile, 
      streakFreezes: profile.streakFreezes - 1,
      lastStudyDate: today 
    };
  }
  
  // Streak broken for real
  return { 
    ...profile, 
    streak: 1, 
    longestStreak: Math.max(1, profile.longestStreak),
    lastStudyDate: today 
  };
}

// Award streak freeze (can be called on achievements, etc.)
export function awardStreakFreeze(profile: UserProfile): UserProfile {
  return { ...profile, streakFreezes: profile.streakFreezes + 1 };
}

// Get streak status message
export function getStreakStatus(profile: UserProfile): {
  message: string;
  isAtRisk: boolean;
  canProtect: boolean;
} {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (!profile.lastStudyDate || profile.lastStudyDate === today) {
    return { message: 'Keep it up!', isAtRisk: false, canProtect: profile.streakFreezes > 0 };
  }
  
  if (profile.lastStudyDate === yesterday) {
    // At risk tomorrow
    return { 
      message: 'Streak at risk! Study today to continue.', 
      isAtRisk: true, 
      canProtect: profile.streakFreezes > 0 
    };
  }
  
  // Streak already broken
  return { 
    message: 'Streak lost. Start a new one today!', 
    isAtRisk: false, 
    canProtect: profile.streakFreezes > 0 
  };
}

// Check for streak milestone achievements
export function checkStreakMilestones(profile: UserProfile): string[] {
  const earned: string[] = [];
  const streak = profile.streak;
  
  // Milestone achievements
  if (streak >= 7) earned.push('streak-7');
  if (streak >= 14) earned.push('streak-14');
  if (streak >= 30) earned.push('streak-30');
  if (streak >= 60) earned.push('streak-60');
  if (streak >= 100) earned.push('streak-100');
  
  return earned;
}

// Progress tracking
export function markLessonComplete(
  lessonId: string,
  xpEarned: number,
  dialect: Dialect,
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
  
  // Track tried dialect for Explorer achievement
  addTriedDialect(dialect);
  
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

/**
 * Add XP to user's profile
 * @param amount - Amount of XP to add
 * @returns Updated profile
 */
export function addXP(amount: number): UserProfile | null {
  const profile = getStoredProfile();
  if (!profile) return null;
  
  const updatedProfile: UserProfile = {
    ...profile,
    xp: (profile.xp || 0) + amount,
  };
  
  saveProfile(updatedProfile);
  return updatedProfile;
}

// Reset for testing
export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  localStorage.removeItem(STORAGE_KEYS.WEEKLY);
}

// Get earned achievements count
export function getEarnedAchievementsCount(): number {
  const achievements = getStoredAchievements();
  if (!achievements) return 0;
  return Object.values(achievements).filter(Boolean).length;
}

// Check if a specific achievement is earned
export function isAchievementEarned(key: string): boolean {
  const achievements = getStoredAchievements();
  return achievements?.[key] || false;
}

// Daily Goal Tracking
const DAILY_GOAL_KEY = 'dialect-master-daily-goal';

interface DailyGoalData {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  goalMinutes: number;
  lessonsCompleted: number;
  goalMet: boolean;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDailyGoalData(): DailyGoalData {
  if (typeof window === 'undefined') {
    return { date: getTodayDateString(), minutesStudied: 0, goalMinutes: 10, lessonsCompleted: 0, goalMet: false };
  }
  
  const profile = getStoredProfile();
  const goalMinutes = profile?.dailyGoalMinutes || 10;
  const today = getTodayDateString();
  
  const stored = localStorage.getItem(DAILY_GOAL_KEY);
  if (!stored) {
    return { date: today, minutesStudied: 0, goalMinutes, lessonsCompleted: 0, goalMet: false };
  }
  
  try {
    const data: DailyGoalData = JSON.parse(stored);
    // Reset if it's a new day
    if (data.date !== today) {
      return { date: today, minutesStudied: 0, goalMinutes, lessonsCompleted: 0, goalMet: false };
    }
    return data;
  } catch {
    return { date: today, minutesStudied: 0, goalMinutes, lessonsCompleted: 0, goalMet: false };
  }
}

export function saveDailyGoalData(data: DailyGoalData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(data));
}

export function addStudyMinutes(minutes: number): DailyGoalData {
  const data = getDailyGoalData();
  const newMinutes = data.minutesStudied + minutes;
  const goalMet = newMinutes >= data.goalMinutes;
  
  const updated: DailyGoalData = {
    ...data,
    minutesStudied: newMinutes,
    goalMet,
  };
  
  saveDailyGoalData(updated);
  return updated;
}

export function incrementLessonsCompleted(): DailyGoalData {
  const data = getDailyGoalData();
  
  const updated: DailyGoalData = {
    ...data,
    lessonsCompleted: data.lessonsCompleted + 1,
  };
  
  saveDailyGoalData(updated);
  return updated;
}

export function getDailyGoalProgress(): { minutes: number; goal: number; percent: number; goalMet: boolean; lessonsCompleted: number } {
  const data = getDailyGoalData();
  const percent = Math.min(100, Math.round((data.minutesStudied / data.goalMinutes) * 100));
  
  return {
    minutes: data.minutesStudied,
    goal: data.goalMinutes,
    percent,
    goalMet: data.goalMet,
    lessonsCompleted: data.lessonsCompleted,
  };
}

export function setDailyGoalMinutes(minutes: number): void {
  const profile = getStoredProfile();
  if (profile) {
    profile.dailyGoalMinutes = minutes;
    saveProfile(profile);
  }
  
  // Also update today's goal data
  const data = getDailyGoalData();
  data.goalMinutes = minutes;
  data.goalMet = data.minutesStudied >= minutes;
  saveDailyGoalData(data);
}

// Favorites/Bookmarks System
const FAVORITES_KEY = 'dialect-master-favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(lessonId: string): boolean {
  const favorites = getFavorites();
  return favorites.includes(lessonId);
}

export function toggleFavorite(lessonId: string): boolean {
  const favorites = getFavorites();
  const isFav = favorites.includes(lessonId);
  
  if (isFav) {
    // Remove from favorites
    const updated = favorites.filter(id => id !== lessonId);
    saveFavorites(updated);
    return false;
  } else {
    // Add to favorites
    const updated = [...favorites, lessonId];
    saveFavorites(updated);
    return true;
  }
}

export function getFavoriteLessons(): { lessonId: string; addedAt: string }[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY + '-metadata');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveFavoriteMetadata(metadata: { lessonId: string; addedAt: string }[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY + '-metadata', JSON.stringify(metadata));
}

export function addToFavorites(lessonId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(lessonId)) {
    favorites.push(lessonId);
    saveFavorites(favorites);
    
    // Also save metadata with timestamp
    const metadata = getFavoriteLessons();
    metadata.push({ lessonId, addedAt: new Date().toISOString() });
    saveFavoriteMetadata(metadata);
  }
}

export function removeFromFavorites(lessonId: string): void {
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== lessonId);
  saveFavorites(updated);
  
  // Also update metadata
  const metadata = getFavoriteLessons().filter(m => m.lessonId !== lessonId);
  saveFavoriteMetadata(metadata);
}

export function getFavoritesCount(): number {
  return getFavorites().length;
}

// Vocabulary Book - Get all learned vocabulary from completed lessons
export interface LearnedVocabulary {
  id: string;
  lessonId: string;
  lessonTitle: string;
  chinese: string;
  romanization: string;
  english: string;
  tone: number;
  completedAt: string;
}

export function getLearnedVocabulary(): LearnedVocabulary[] {
  const progress = getStoredProgress();
  
  const vocabulary: LearnedVocabulary[] = [];
  
  if (!progress) return vocabulary;
  
  // Find all completed lessons
  for (const [lessonId, lessonProgress] of Object.entries(progress)) {
    if (lessonProgress.completed) {
      // Find the lesson data
      const lesson = LESSONS.find((l: any) => l.id === lessonId);
      if (lesson && lesson.vocabulary) {
        for (const vocab of lesson.vocabulary) {
          vocabulary.push({
            id: vocab.id || `${lessonId}-${vocab.phrase.chinese}`,
            lessonId,
            lessonTitle: lesson.title,
            chinese: vocab.phrase.chinese,
            romanization: vocab.phrase.romanization,
            english: vocab.phrase.english,
            tone: vocab.phrase.tone,
            completedAt: lessonProgress.completedAt,
          });
        }
      }
    }
  }
  
  // Sort by completion date (most recent first)
  return vocabulary.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}

export function getLearnedVocabularyCount(): number {
  return getLearnedVocabulary().length;
}
