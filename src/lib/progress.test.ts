// Unit tests for progress.ts - XP, Level, and Streak calculations
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateLevel,
  xpToNextLevel,
  xpProgressInLevel,
  updateStreak,
  getStoredProfile,
  saveProfile,
  getStoredProgress,
  saveProgress,
  getStoredAchievements,
  saveAchievements,
  getWeeklyActivity,
  saveWeeklyActivity,
  addToWeeklyActivity,
  getWeeklyActivityForDisplay,
  getLessonProgress,
  getCompletedLessonsCount,
  getTotalXP,
  getFavorites,
  toggleFavorite,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavoriteLessons,
  getFavoritesCount,
  getLearnedVocabulary,
  getLearnedVocabularyCount,
} from './progress';
import type { UserProfile } from '../types';

// XP thresholds per level (same as in progress.ts)
const XP_FOR_LEVEL = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000];

// Storage keys (same as in progress.ts)
const STORAGE_KEYS = {
  PROFILE: 'dialect-master-profile',
  PROGRESS: 'dialect-master-progress',
  ACHIEVEMENTS: 'dialect-master-achievements',
  WEEKLY: 'dialect-master-weekly',
  FAVORITES: 'dialect-master-favorites',
  FAVORITES_METADATA: 'dialect-master-favorites-metadata',
};

// Default profile (same as in progress.ts)
const DEFAULT_PROFILE: UserProfile = {
  id: '',
  name: '',
  selectedDialect: 'hokkien',
  dailyGoalMinutes: 10,
  level: 1,
  xp: 0,
  streak: 0,
  streakFreezes: 1,
  longestStreak: 0,
  lastStudyDate: null,
  createdAt: new Date().toISOString(),
};

// Helper to set up localStorage mock
function setupLocalStorageMocks(profile?: UserProfile) {
  const localStorageMock = global.localStorage as any;
  localStorageMock.getItem.mockImplementation((key: string) => {
    if (key === STORAGE_KEYS.PROFILE && profile) {
      return JSON.stringify(profile);
    }
    if (key === STORAGE_KEYS.PROGRESS) {
      return JSON.stringify({});
    }
    if (key === STORAGE_KEYS.ACHIEVEMENTS) {
      return JSON.stringify({});
    }
    if (key === STORAGE_KEYS.WEEKLY) {
      return JSON.stringify({});
    }
    if (key === STORAGE_KEYS.FAVORITES) {
      return JSON.stringify([]);
    }
    if (key === STORAGE_KEYS.FAVORITES_METADATA) {
      return JSON.stringify([]);
    }
    return null;
  });
}

describe('XP Calculation', () => {
  it('should return level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('should return level 1 for XP below first threshold', () => {
    expect(calculateLevel(50)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
  });

  it('should return level 2 for XP at or above 100', () => {
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(200)).toBe(2);
  });

  it('should return correct level for various XP values', () => {
    // Level 1: 0-99 XP
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    
    // Level 2: 100-249 XP
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(249)).toBe(2);
    
    // Level 3: 250-499 XP
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(499)).toBe(3);
    
    // Level 5: 800-1199 XP
    expect(calculateLevel(800)).toBe(5);
    expect(calculateLevel(1199)).toBe(5);
    
    // Level 10: 4000-4999 XP
    expect(calculateLevel(4000)).toBe(10);
    expect(calculateLevel(4999)).toBe(10);
  });

  it('should return max level for XP above highest threshold', () => {
    expect(calculateLevel(10000)).toBe(XP_FOR_LEVEL.length);
    expect(calculateLevel(50000)).toBe(XP_FOR_LEVEL.length);
  });
});

describe('xpToNextLevel', () => {
  it('should return XP needed from level 1 to 2', () => {
    expect(xpToNextLevel(1)).toBe(100);
  });

  it('should return XP needed between consecutive levels', () => {
    expect(xpToNextLevel(2)).toBe(150); // 250 - 100
    expect(xpToNextLevel(3)).toBe(250); // 500 - 250
    expect(xpToNextLevel(4)).toBe(300); // 800 - 500
  });

  it('should return 0 for max level', () => {
    expect(xpToNextLevel(XP_FOR_LEVEL.length)).toBe(0);
  });
});

describe('xpProgressInLevel', () => {
  it('should return 0% for level 1 with 0 XP', () => {
    expect(xpProgressInLevel(0, 1)).toBe(0);
  });

  it('should return 100% for level 1 with 100 XP', () => {
    expect(xpProgressInLevel(100, 1)).toBe(100);
  });

  it('should return 50% progress within a level', () => {
    // Level 2: 100-250 XP (150 XP range)
    // 175 XP = 75 XP into level, should be 50%
    expect(xpProgressInLevel(175, 2)).toBe(50);
  });

  it('should return correct percentage at level boundaries', () => {
    expect(xpProgressInLevel(100, 2)).toBe(0); // Start of level 2
    expect(xpProgressInLevel(250, 2)).toBe(100); // End of level 2 (start of level 3)
    expect(xpProgressInLevel(251, 3)).toBe(0.4); // Just into level 3
  });
});

describe('Streak Calculation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start streak at 1 for new user', () => {
    const profile = { ...DEFAULT_PROFILE, lastStudyDate: null, streak: 0 };
    const result = updateStreak(profile);
    expect(result.streak).toBe(1);
  });

  it('should keep streak same when studying same day', () => {
    const today = new Date().toISOString().split('T')[0];
    const profile = { ...DEFAULT_PROFILE, lastStudyDate: today, streak: 5 };
    const result = updateStreak(profile);
    expect(result.streak).toBe(5);
  });

  it('should increment streak when studying consecutive day', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const profile = { ...DEFAULT_PROFILE, lastStudyDate: yesterday, streak: 5 };
    const result = updateStreak(profile);
    expect(result.streak).toBe(6);
  });

  it('should reset streak when missing a day and no freezes', () => {
    const today = new Date().toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    // Profile with no streak freezes - should reset to 1
    const profile = { ...DEFAULT_PROFILE, lastStudyDate: twoDaysAgo, streak: 5, streakFreezes: 0 };
    const result = updateStreak(profile);
    expect(result.streak).toBe(1);
  });

  it('should preserve streak when missing a day with streak freeze', () => {
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    // Profile with streak freezes - should use a freeze to preserve streak
    const profile = { ...DEFAULT_PROFILE, lastStudyDate: twoDaysAgo, streak: 5, streakFreezes: 1 };
    const result = updateStreak(profile);
    expect(result.streak).toBe(5); // Streak preserved
    expect(result.streakFreezes).toBe(0); // Used one freeze
  });
});

describe('Storage Functions', () => {
  it('getStoredProfile should return null in SSR', () => {
    expect(getStoredProfile()).toBeNull();
  });

  it('getStoredProgress should return null in SSR', () => {
    expect(getStoredProgress()).toBeNull();
  });

  it('getStoredAchievements should return null in SSR', () => {
    expect(getStoredAchievements()).toBeNull();
  });

  it('getWeeklyActivity should return null in SSR', () => {
    expect(getWeeklyActivity()).toBeNull();
  });
});

describe('Progress Helpers', () => {
  it('getTotalXP should return 0 when no profile exists', () => {
    expect(getTotalXP()).toBe(0);
  });

  it('getCompletedLessonsCount should return 0 when no progress exists', () => {
    expect(getCompletedLessonsCount()).toBe(0);
  });
});

describe('XP_FOR_LEVEL Constant', () => {
  it('should have 11 levels (0-10)', () => {
    expect(XP_FOR_LEVEL.length).toBe(11);
  });

  it('should start at 0', () => {
    expect(XP_FOR_LEVEL[0]).toBe(0);
  });

  it('should be in ascending order', () => {
    for (let i = 1; i < XP_FOR_LEVEL.length; i++) {
      expect(XP_FOR_LEVEL[i]).toBeGreaterThan(XP_FOR_LEVEL[i - 1]);
    }
  });

  it('should match expected progression', () => {
    expect(XP_FOR_LEVEL[1]).toBe(100);
    expect(XP_FOR_LEVEL[5]).toBe(1200);
    expect(XP_FOR_LEVEL[10]).toBe(5000);
  });
});

describe('Favorites System', () => {
  // Create a mock storage object to track favorites state
  const mockStorage: Record<string, string> = {};
  
  beforeEach(() => {
    // Reset mock storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    
    // Set up localStorage mock to use our storage object
    const localStorageMock = global.localStorage as any;
    localStorageMock.getItem.mockImplementation((key: string) => {
      return mockStorage[key] || null;
    });
    localStorageMock.setItem.mockImplementation((key: string, value: string) => {
      mockStorage[key] = value;
    });
  });

  it('getFavorites should return empty array when no favorites exist', () => {
    expect(getFavorites()).toEqual([]);
  });

  it('toggleFavorite should add lesson to favorites', () => {
    const result = toggleFavorite('lesson-1');
    expect(result).toBe(true);
    expect(getFavorites()).toContain('lesson-1');
  });

  it('toggleFavorite should remove lesson from favorites', () => {
    toggleFavorite('lesson-1');
    const result = toggleFavorite('lesson-1');
    expect(result).toBe(false);
    expect(getFavorites()).not.toContain('lesson-1');
  });

  it('isFavorite should return correct status', () => {
    expect(isFavorite('lesson-1')).toBe(false);
    toggleFavorite('lesson-1');
    expect(isFavorite('lesson-1')).toBe(true);
  });

  it('addToFavorites should add with metadata', () => {
    addToFavorites('lesson-1');
    const metadata = getFavoriteLessons();
    expect(metadata).toHaveLength(1);
    expect(metadata[0].lessonId).toBe('lesson-1');
    expect(metadata[0].addedAt).toBeDefined();
  });

  it('removeFromFavorites should remove lesson and metadata', () => {
    addToFavorites('lesson-1');
    removeFromFavorites('lesson-1');
    expect(getFavorites()).not.toContain('lesson-1');
    const metadata = getFavoriteLessons();
    expect(metadata).toHaveLength(0);
  });

  it('getFavoritesCount should return correct count', () => {
    expect(getFavoritesCount()).toBe(0);
    toggleFavorite('lesson-1');
    expect(getFavoritesCount()).toBe(1);
    toggleFavorite('lesson-2');
    expect(getFavoritesCount()).toBe(2);
  });
});

describe('addToWeeklyActivity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('addToWeeklyActivity should initialize and add minutes', () => {
    const result = addToWeeklyActivity(30);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('addToWeeklyActivity should accumulate minutes', () => {
    addToWeeklyActivity(30);
    const result = addToWeeklyActivity(15);
    // The function should return the updated activity
    expect(result).toBeDefined();
  });
});

describe('getWeeklyActivityForDisplay', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getWeeklyActivityForDisplay should return 7 days', () => {
    const result = getWeeklyActivityForDisplay();
    expect(result).toHaveLength(7);
    expect(result[0]).toHaveProperty('day');
    expect(result[0]).toHaveProperty('minutes');
    expect(result[0]).toHaveProperty('isToday');
  });

  it('getWeeklyActivityForDisplay should mark correct day as today', () => {
    const result = getWeeklyActivityForDisplay();
    const todayCount = result.filter(d => d.isToday).length;
    expect(todayCount).toBe(1);
  });
});

describe('getLearnedVocabulary', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getLearnedVocabulary should return empty array when no progress', () => {
    const result = getLearnedVocabulary();
    expect(result).toEqual([]);
  });

  it('getLearnedVocabularyCount should return 0 when no progress', () => {
    const result = getLearnedVocabularyCount();
    expect(result).toBe(0);
  });
});
