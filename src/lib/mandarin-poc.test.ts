// Unit tests for Mandarin POC matching algorithm
import { calculateChineseMatch, levenshteinDistance, runManualTests } from './mandarin-poc';

describe('Mandarin POC - Levenshtein Distance', () => {
  
  describe('levenshteinDistance', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('你好', '你好')).toBe(0);
      expect(levenshteinDistance('谢谢', '谢谢')).toBe(0);
    });
    
    it('should calculate distance for different strings', () => {
      expect(levenshteinDistance('你好', '您好')).toBe(1);
      expect(levenshteinDistance('a', 'b')).toBe(1);
      expect(levenshteinDistance('', 'abc')).toBe(3);
    });
    
    it('should handle empty strings', () => {
      expect(levenshteinDistance('', '')).toBe(0);
      expect(levenshteinDistance('abc', '')).toBe(3);
      expect(levenshteinDistance('', 'abc')).toBe(3);
    });
  });
  
  describe('calculateChineseMatch', () => {
    it('should return 100% for exact match', () => {
      expect(calculateChineseMatch('你好', '你好')).toBe(100);
      expect(calculateChineseMatch('谢谢', '谢谢')).toBe(100);
    });
    
    it('should return reasonable percentage for similar characters', () => {
      // 你好 vs 您好 - 1 character different out of 2
      const match = calculateChineseMatch('您好', '你好');
      // Levenshtein distance: 1 char difference / 2 chars = 50% match
      expect(match).toBeGreaterThanOrEqual(40);
      expect(match).toBeLessThan(100);
    });
    
    it('should return low percentage for completely different phrases', () => {
      expect(calculateChineseMatch('谢谢', '你好')).toBeLessThan(50);
      expect(calculateChineseMatch('我爱你', '多少钱')).toBeLessThan(50);
    });
    
    it('should handle exact substring matches', () => {
      // "你好" is contained in "你好吗"
      expect(calculateChineseMatch('你好吗', '你好')).toBeGreaterThanOrEqual(60);
    });
    
    it('should return at least 10% for very different strings', () => {
      const match = calculateChineseMatch('abc', 'xyz');
      expect(match).toBeGreaterThanOrEqual(10);
    });
    
    it('should return at most 100%', () => {
      const results = [
        calculateChineseMatch('你好', '你好'),
        calculateChineseMatch('谢谢', '再见'),
        calculateChineseMatch('我爱你', '大家好'),
      ];
      results.forEach(match => {
        expect(match).toBeLessThanOrEqual(100);
      });
    });
  });
  
  describe('runManualTests', () => {
    it('should return test results array', () => {
      const results = runManualTests();
      expect(results).toHaveLength(4);
      expect(results[0].matchPercentage).toBe(100); // Exact match
      expect(results[2].matchPercentage).toBeLessThan(50); // Different phrases
    });
  });
});
