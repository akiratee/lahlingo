// Tests for Daily Challenge feature
import { describe, it, expect } from 'vitest';
import {
  getChallengeDialect,
  getChallengeType,
  getDailyChallenge,
  getTimeUntilNextChallenge,
  hasCompletedTodayChallenge,
} from '../lib/daily-challenge';

describe('Daily Challenge', () => {
  describe('getChallengeDialect', () => {
    it('returns a valid dialect', () => {
      const dialect = getChallengeDialect();
      expect(['hokkien', 'teochew', 'cantonese', 'hakka']).toContain(dialect);
    });
  });

  describe('getChallengeType', () => {
    it('returns a valid challenge type', () => {
      const type = getChallengeType();
      expect(['vocabulary', 'listening', 'tones', 'mixed']).toContain(type);
    });
  });

  describe('getDailyChallenge', () => {
    it('returns a challenge with all required fields', () => {
      const challenge = getDailyChallenge();
      
      expect(challenge).toHaveProperty('date');
      expect(challenge).toHaveProperty('dialect');
      expect(challenge).toHaveProperty('type');
      expect(challenge).toHaveProperty('title');
      expect(challenge).toHaveProperty('description');
      expect(challenge).toHaveProperty('xpBonus');
      expect(challenge).toHaveProperty('questions');
    });

    it('returns a challenge with questions', () => {
      const challenge = getDailyChallenge();
      expect(challenge.questions.length).toBeGreaterThan(0);
    });

    it('questions have correct format', () => {
      const challenge = getDailyChallenge();
      const question = challenge.questions[0];
      
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('correctIndex');
      expect(question.options.length).toBeGreaterThan(1);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.options.length);
    });

    it('has correct XP bonus values', () => {
      const challenge = getDailyChallenge();
      // Base 50 + 25 for mixed = 75
      expect(challenge.xpBonus).toBeGreaterThanOrEqual(50);
    });
  });

  describe('getTimeUntilNextChallenge', () => {
    it('returns positive hours and minutes', () => {
      const { hours, minutes } = getTimeUntilNextChallenge();
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(24);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThan(60);
    });
  });

  describe('hasCompletedTodayChallenge', () => {
    it('returns false when no profile exists', () => {
      // Clear any existing localStorage
      localStorage.clear();
      expect(hasCompletedTodayChallenge()).toBe(false);
    });
  });
});
