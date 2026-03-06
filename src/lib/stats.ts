// Learning statistics and analytics
import { getStoredProfile, getStoredProgress, getStoredAchievements, getWeeklyActivity } from './progress';
import { Dialect } from '../types';

export interface LearningStats {
  totalLessonsCompleted: number;
  totalXPEarned: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezesRemaining: number;
  totalAchievementsEarned: number;
  totalAchievements: number;
  favoriteDialect: Dialect | null;
  lessonsByDialect: Record<Dialect, number>;
  weeklyMinutes: number[];
  averageQuizScore: number;
  lastStudyDate: string | null;
  daysSinceStart: number;
  dailyGoalMet: number;
  totalDaysActive: number;
}

const DIALECTS: Dialect[] = ['hokkien', 'teochew', 'cantonese', 'hakka'];

// Calculate all learning statistics
export function calculateLearningStats(): LearningStats {
  const profile = getStoredProfile();
  const progress = getStoredProgress();
  const achievements = getStoredAchievements();
  const weekly = getWeeklyActivity() || {};
  
  const totalLessonsCompleted = progress ? Object.keys(progress).length : 0;
  const totalXPEarned = profile?.xp || 0;
  const currentLevel = profile?.level || 1;
  const currentStreak = profile?.streak || 0;
  const longestStreak = profile?.longestStreak || 0;
  const streakFreezesRemaining = profile?.streakFreezes || 1;
  const totalAchievementsEarned = achievements ? Object.values(achievements).filter(Boolean).length : 0;
  const lastStudyDate = profile?.lastStudyDate || null;
  
  // Calculate days since account creation
  let daysSinceStart = 0;
  if (profile?.createdAt) {
    const created = new Date(profile.createdAt);
    const now = new Date();
    daysSinceStart = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  // Calculate lessons by dialect (simplified - counts all lessons)
  const lessonsByDialect: Record<Dialect, number> = {
    hokkien: 0,
    teochew: 0,
    cantonese: 0,
    hakka: 0,
  };
  
  // For now, distribute lessons across dialects (would need dialect in progress)
  // This is a simplified calculation
  if (progress) {
    const lessonCount = Object.keys(progress).length;
    // Assign roughly to dialects based on lesson IDs (simplified)
    lessonsByDialect.hokkien = Math.ceil(lessonCount * 0.4);
    lessonsByDialect.teochew = Math.ceil(lessonCount * 0.3);
    lessonsByDialect.cantonese = Math.ceil(lessonCount * 0.2);
    lessonsByDialect.hakka = Math.floor(lessonCount * 0.1);
  }
  
  // Weekly minutes (last 7 days)
  const weeklyMinutes: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    weeklyMinutes.push(weekly[dateStr] || 0);
  }
  
  // Calculate average quiz score
  let averageQuizScore = 0;
  if (progress) {
    const scores = Object.values(progress)
      .filter(p => p.quizScore !== undefined)
      .map(p => p.quizScore || 0);
    if (scores.length > 0) {
      averageQuizScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  }
  
  // Count days where goal was met
  const dailyGoalMet = Object.values(weekly).filter(m => (profile?.dailyGoalMinutes || 10) <= m).length;
  
  // Total days active (unique dates with activity)
  const totalDaysActive = Object.keys(weekly).length || 1;
  
  // Determine favorite dialect (most lessons)
  let favoriteDialect: Dialect | null = null;
  let maxLessons = 0;
  for (const dialect of DIALECTS) {
    if (lessonsByDialect[dialect] > maxLessons) {
      maxLessons = lessonsByDialect[dialect];
      favoriteDialect = dialect;
    }
  }
  
  return {
    totalLessonsCompleted,
    totalXPEarned,
    currentLevel,
    currentStreak,
    longestStreak,
    streakFreezesRemaining,
    totalAchievementsEarned,
    totalAchievements: 15, // Total achievements defined
    favoriteDialect,
    lessonsByDialect,
    weeklyMinutes,
    averageQuizScore,
    lastStudyDate,
    daysSinceStart,
    dailyGoalMet,
    totalDaysActive,
  };
}

// Get streak status description
export function getStreakDescription(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak < 3) return "Great start! Keep it going!";
  if (streak < 7) return "You're on fire! 🔥";
  if (streak < 14) return "Amazing dedication! 💪";
  if (streak < 30) return "Incredible consistency! 🌟";
  if (streak < 60) return "You're a language champion! 🏆";
  if (streak < 100) return "Legendary learner! 👑";
  return "Master status achieved! 🌈";
}

// Get level description
export function getLevelDescription(level: number): string {
  if (level === 1) return "Beginner - Just starting out";
  if (level === 2) return "Learning the basics";
  if (level === 3) return "Building vocabulary";
  if (level === 4) return "Making progress";
  if (level === 5) return "Intermediate learner";
  if (level === 6) return "Advanced learner";
  if (level === 7) return "Expert level";
  if (level === 8) return "Near mastery";
  if (level === 9) return "Almost master";
  return "Dialect Master!";
}

// Calculate XP needed for next level
export function getXPForNextLevel(currentLevel: number): { current: number; needed: number; percent: number } {
  const xpThresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000];
  const profile = getStoredProfile();
  const currentXP = profile?.xp || 0;
  
  if (currentLevel >= xpThresholds.length) {
    return { current: currentXP, needed: 0, percent: 100 };
  }
  
  const needed = xpThresholds[currentLevel] - currentXP;
  const percent = Math.max(0, Math.min(100, Math.round(((currentXP - xpThresholds[currentLevel - 1]) / (xpThresholds[currentLevel] - xpThresholds[currentLevel - 1])) * 100)));
  
  return {
    current: currentXP,
    needed: Math.max(0, needed),
    percent,
  };
}

// Get weekly trend (is user improving?)
export function getWeeklyTrend(): { direction: 'up' | 'down' | 'stable'; percentage: number } {
  const weekly = getWeeklyActivity() || {};
  const today = new Date();
  
  // This week vs last week
  let thisWeekMinutes = 0;
  let lastWeekMinutes = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    thisWeekMinutes += weekly[dateStr] || 0;
  }
  
  for (let i = 7; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    lastWeekMinutes += weekly[dateStr] || 0;
  }
  
  if (lastWeekMinutes === 0) {
    return { direction: 'up', percentage: 100 };
  }
  
  const change = ((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100;
  
  if (change > 10) {
    return { direction: 'up', percentage: Math.round(change) };
  } else if (change < -10) {
    return { direction: 'down', percentage: Math.round(Math.abs(change)) };
  }
  
  return { direction: 'stable', percentage: Math.round(Math.abs(change)) };
}
