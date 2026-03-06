// Family Recordings Tests

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getFamilyRecordings, 
  getFamilyRecording, 
  getLessonFamilyRecordings,
  saveFamilyRecording, 
  deleteFamilyRecording,
  getFamilyRecordingCount,
  clearAllFamilyRecordings,
  FamilyRecording
} from './family-recordings';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Family Recordings', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getFamilyRecordings', () => {
    it('should return empty array when no recordings exist', () => {
      expect(getFamilyRecordings()).toEqual([]);
    });

    it('should return recordings from localStorage', () => {
      const mockRecording: FamilyRecording = {
        id: 'test-1',
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test',
        recordedBy: 'Dad',
        createdAt: '2026-03-06T00:00:00Z'
      };
      localStorageMock.setItem('lahlingo_family_recordings', JSON.stringify([mockRecording]));
      
      const recordings = getFamilyRecordings();
      expect(recordings).toHaveLength(1);
      expect(recordings[0].phraseId).toBe('h1-1');
    });
  });

  describe('getFamilyRecording', () => {
    it('should return undefined when no recordings exist', () => {
      expect(getFamilyRecording('h1-1')).toBeUndefined();
    });

    it('should return specific recording by phraseId', () => {
      const mockRecording: FamilyRecording = {
        id: 'test-1',
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test',
        recordedBy: 'Dad',
        createdAt: '2026-03-06T00:00:00Z'
      };
      localStorageMock.setItem('lahlingo_family_recordings', JSON.stringify([mockRecording]));
      
      const recording = getFamilyRecording('h1-1');
      expect(recording).toBeDefined();
      expect(recording?.recordedBy).toBe('Dad');
    });
  });

  describe('getLessonFamilyRecordings', () => {
    it('should return recordings for a lesson unit', () => {
      const recordings: FamilyRecording[] = [
        {
          id: 'test-1',
          phraseId: 'h1-1',
          chinese: '你好',
          romanization: 'li-ho',
          audioBlob: 'data:audio/webm;base64,test1',
          recordedBy: 'Dad',
          createdAt: '2026-03-06T00:00:00Z'
        },
        {
          id: 'test-2',
          phraseId: 'h1-2',
          chinese: '食飽未',
          romanization: 'chia-be',
          audioBlob: 'data:audio/webm;base64,test2',
          recordedBy: 'Mom',
          createdAt: '2026-03-06T00:00:00Z'
        },
        {
          id: 'test-3',
          phraseId: 'h2-1',
          chinese: '感謝',
          romanization: 'kam-sa',
          audioBlob: 'data:audio/webm;base64,test3',
          recordedBy: 'Grandma',
          createdAt: '2026-03-06T00:00:00Z'
        }
      ];
      localStorageMock.setItem('lahlingo_family_recordings', JSON.stringify(recordings));
      
      const lessonRecordings = getLessonFamilyRecordings('hokkien-u1-l1');
      expect(lessonRecordings).toHaveLength(2);
      expect(lessonRecordings.map(r => r.recordedBy)).toContain('Dad');
      expect(lessonRecordings.map(r => r.recordedBy)).toContain('Mom');
    });

    it('should return empty array for invalid lessonId', () => {
      expect(getLessonFamilyRecordings('invalid')).toEqual([]);
    });
  });

  describe('saveFamilyRecording', () => {
    it('should save a new recording', () => {
      const recording = saveFamilyRecording({
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test',
        recordedBy: 'Dad'
      });

      expect(recording.id).toBeDefined();
      expect(recording.createdAt).toBeDefined();
      expect(recording.phraseId).toBe('h1-1');
      
      const stored = getFamilyRecordings();
      expect(stored).toHaveLength(1);
    });

    it('should replace existing recording for same phrase', () => {
      saveFamilyRecording({
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test1',
        recordedBy: 'Dad'
      });
      
      saveFamilyRecording({
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test2',
        recordedBy: 'Mom'
      });

      const stored = getFamilyRecordings();
      expect(stored).toHaveLength(1);
      expect(stored[0].recordedBy).toBe('Mom');
    });
  });

  describe('deleteFamilyRecording', () => {
    it('should delete a recording by id', () => {
      const recording = saveFamilyRecording({
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test',
        recordedBy: 'Dad'
      });

      const result = deleteFamilyRecording(recording.id);
      expect(result).toBe(true);
      expect(getFamilyRecordings()).toHaveLength(0);
    });

    it('should return false for non-existent id', () => {
      const result = deleteFamilyRecording('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('getFamilyRecordingCount', () => {
    it('should return 0 when no recordings', () => {
      expect(getFamilyRecordingCount()).toBe(0);
    });

    it('should return correct count', () => {
      saveFamilyRecording({
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test1',
        recordedBy: 'Dad'
      });
      saveFamilyRecording({
        phraseId: 'h1-2',
        chinese: '食飽未',
        romanization: 'chia-be',
        audioBlob: 'data:audio/webm;base64,test2',
        recordedBy: 'Mom'
      });

      expect(getFamilyRecordingCount()).toBe(2);
    });
  });

  describe('clearAllFamilyRecordings', () => {
    it('should clear all recordings', () => {
      saveFamilyRecording({
        phraseId: 'h1-1',
        chinese: '你好',
        romanization: 'li-ho',
        audioBlob: 'data:audio/webm;base64,test',
        recordedBy: 'Dad'
      });

      clearAllFamilyRecordings();
      expect(getFamilyRecordings()).toEqual([]);
    });
  });
});
