// Achievement definitions and management
import { Achievement, UserProgressState } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    key: 'first_words',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👣',
    xpBonus: 100,
    condition: (state) => Object.keys(state.completedLessons).length >= 1,
  },
  {
    id: 'a2',
    key: 'three_lessons',
    title: 'Getting Started',
    description: 'Complete 3 lessons',
    icon: '🎯',
    xpBonus: 150,
    condition: (state) => Object.keys(state.completedLessons).length >= 3,
  },
  {
    id: 'a3',
    key: 'ten_lessons',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '📚',
    xpBonus: 300,
    condition: (state) => Object.keys(state.completedLessons).length >= 10,
  },
  {
    id: 'a4',
    key: 'first_week',
    title: 'First Week',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xpBonus: 500,
    condition: (state) => state.profile.streak >= 7,
  },
  {
    id: 'a5',
    key: 'month_warrior',
    title: 'Month Warrior',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    xpBonus: 1000,
    condition: (state) => state.profile.streak >= 30,
  },
  {
    id: 'a6',
    key: 'tone_master',
    title: 'Tone Master',
    description: 'Score 95%+ on pronunciation',
    icon: '🎤',
    xpBonus: 200,
    condition: (state) => {
      // Check if any completed lesson had high quiz score
      return Object.values(state.completedLessons).some(p => (p.quizScore || 0) >= 95);
    },
  },
  {
    id: 'a7',
    key: 'quick_learner',
    title: 'Quick Learner',
    description: 'Complete 5 lessons in one day',
    icon: '⚡',
    xpBonus: 250,
    condition: (state) => {
      // Would need daily tracking - simplified for MVP
      return Object.keys(state.completedLessons).length >= 5;
    },
  },
  {
    id: 'a8',
    key: 'explorer',
    title: 'Explorer',
    description: 'Try all 4 dialects',
    icon: '🗺️',
    xpBonus: 400,
    condition: (state) => {
      // Track which dialects tried
      return false; // Would need dialect tracking
    },
  },
  {
    id: 'a9',
    key: 'century',
    title: 'Century',
    description: 'Earn 1000 XP',
    icon: '💯',
    xpBonus: 500,
    condition: (state) => state.profile.xp >= 1000,
  },
  {
    id: 'a10',
    key: 'master',
    title: 'Dialect Master',
    description: 'Reach Level 5',
    icon: '🏆',
    xpBonus: 1000,
    condition: (state) => state.profile.level >= 5,
  },
];

export function checkAndAwardAchievements(
  currentState: UserProgressState
): { newAchievements: Achievement[]; updatedState: UserProgressState } {
  const newAchievements: Achievement[] = [];
  const updatedAchievements = { ...currentState.achievements };
  
  for (const achievement of ACHIEVEMENTS) {
    // Skip if already earned
    if (updatedAchievements[achievement.key]) continue;
    
    // Check if condition is met
    if (achievement.condition(currentState)) {
      newAchievements.push(achievement);
      updatedAchievements[achievement.key] = true;
    }
  }
  
  return {
    newAchievements,
    updatedState: {
      ...currentState,
      achievements: updatedAchievements,
    },
  };
}

export function getEarnedAchievements(): Achievement[] {
  // Would read from storage
  return [];
}

export function getLockedAchievements(): Achievement[] {
  // Would compare with storage
  return ACHIEVEMENTS;
}

export function getAchievementProgress(): { earned: number; total: number } {
  return {
    earned: 0, // Would calculate from storage
    total: ACHIEVEMENTS.length,
  };
}
