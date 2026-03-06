import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ACHIEVEMENTS, checkAndAwardAchievements, getAchievementProgress, getEarnedAchievements, getLockedAchievements } from '../lib/achievements';
import { UserProgressState } from '../types';

describe('Achievements System', () => {
  const createMockState = (overrides: Partial<UserProgressState> = {}): UserProgressState => ({
    profile: {
      xp: 0,
      level: 1,
      streak: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      joinedAt: new Date().toISOString(),
    },
    completedLessons: {},
    achievements: {},
    dailyProgress: {
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      xpEarned: 0,
      date: new Date().toISOString().split('T')[0],
    },
    ...overrides,
  });

  describe('ACHIEVEMENTS', () => {
    it('should have all required achievement fields', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('key');
        expect(achievement).toHaveProperty('title');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('xpBonus');
        expect(achievement).toHaveProperty('condition');
        expect(typeof achievement.condition).toBe('function');
      });
    });

    it('should have unique keys', () => {
      const keys = ACHIEVEMENTS.map(a => a.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it('should have at least 10 achievements defined', () => {
      expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('checkAndAwardAchievements', () => {
    it('should award first_words achievement when first lesson completed', () => {
      const state = createMockState({
        completedLessons: { 'lesson-1': { completedAt: new Date().toISOString() } },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements).toHaveLength(1);
      expect(result.newAchievements[0].key).toBe('first_words');
      expect(result.updatedState.achievements).toHaveProperty('first_words', true);
    });

    it('should award three_lessons achievement when 3 lessons completed', () => {
      const state = createMockState({
        completedLessons: {
          'lesson-1': { completedAt: new Date().toISOString() },
          'lesson-2': { completedAt: new Date().toISOString() },
          'lesson-3': { completedAt: new Date().toISOString() },
        },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements.some(a => a.key === 'three_lessons')).toBe(true);
    });

    it('should award ten_lessons achievement when 10 lessons completed', () => {
      const completedLessons: Record<string, { completedAt: string }> = {};
      for (let i = 1; i <= 10; i++) {
        completedLessons[`lesson-${i}`] = { completedAt: new Date().toISOString() };
      }

      const state = createMockState({ completedLessons });
      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements.some(a => a.key === 'ten_lessons')).toBe(true);
    });

    it('should award streak achievements based on streak value', () => {
      const state = createMockState({
        profile: { xp: 0, level: 1, streak: 7, totalLessons: 0, totalQuizzes: 0, joinedAt: new Date().toISOString() },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements.some(a => a.key === 'streak-3')).toBe(true);
      expect(result.newAchievements.some(a => a.key === 'streak-7')).toBe(true);
      expect(result.newAchievements.some(a => a.key === 'streak-14')).toBe(false);
    });

    it('should award century achievement when XP threshold met', () => {
      const state = createMockState({
        profile: { xp: 1000, level: 1, streak: 0, totalLessons: 0, totalQuizzes: 0, joinedAt: new Date().toISOString() },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements.some(a => a.key === 'century')).toBe(true);
    });

    it('should award master achievement when level 5 reached', () => {
      const state = createMockState({
        profile: { xp: 0, level: 5, streak: 0, totalLessons: 0, totalQuizzes: 0, joinedAt: new Date().toISOString() },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements.some(a => a.key === 'master')).toBe(true);
    });

    it('should not award already earned achievements', () => {
      const state = createMockState({
        completedLessons: { 'lesson-1': { completedAt: new Date().toISOString() } },
        achievements: { first_words: true },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements).toHaveLength(0);
    });

    it('should handle multiple achievements at once', () => {
      const state = createMockState({
        profile: { xp: 1500, level: 5, streak: 10, totalLessons: 0, totalQuizzes: 0, joinedAt: new Date().toISOString() },
        completedLessons: {
          'lesson-1': { completedAt: new Date().toISOString() },
          'lesson-2': { completedAt: new Date().toISOString() },
          'lesson-3': { completedAt: new Date().toISOString() },
        },
      });

      const result = checkAndAwardAchievements(state);

      expect(result.newAchievements.length).toBeGreaterThan(1);
    });

    it('should not modify original state', () => {
      const state = createMockState({
        completedLessons: { 'lesson-1': { completedAt: new Date().toISOString() } },
      });
      const originalAchievements = { ...state.achievements };

      checkAndAwardAchievements(state);

      expect(state.achievements).toEqual(originalAchievements);
    });
  });

  describe('getEarnedAchievements', () => {
    it('should return empty array (placeholder implementation)', () => {
      const result = getEarnedAchievements();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getLockedAchievements', () => {
    it('should return all achievements', () => {
      const result = getLockedAchievements();
      expect(result).toEqual(ACHIEVEMENTS);
    });
  });

  describe('getAchievementProgress', () => {
    it('should return progress object with total count', () => {
      const result = getAchievementProgress();
      expect(result).toHaveProperty('earned');
      expect(result).toHaveProperty('total');
      expect(result.total).toBe(ACHIEVEMENTS.length);
    });
  });
});
