// Vitest setup file
import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn((index: number) => null),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window object
(global as any).window = {
  AudioContext: class AudioContext {
    close() {}
  },
  webkitAudioContext: class WebkitAudioContext {
    close() {}
  },
  speechSynthesis: null,
  SpeechRecognition: undefined,
  webkitSpeechRecognition: undefined,
};

// Reset mocks between tests
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
});
