// Vitest setup file
import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage with actual storage behavior
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] || null),
  };
};

const localStorageMock = createLocalStorageMock();

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
