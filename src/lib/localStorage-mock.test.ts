// LahLingo Progress Tests - localStorage Mock Fix
// These tests should be added to fix the failing favorites/weeklyActivity/vocabulary tests

import { vi, beforeEach, describe, it, expect } from 'vitest';

// Mock localStorage for Node.js environment
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

// In your test setup or vitest.config.ts, add:
/*
vi.stubGlobal('localStorage', createLocalStorageMock());
*/

// Test case example:
describe('localStorage Mock Fix', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should properly mock localStorage getItem', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    expect(localStorage.getItem('nonexistent')).toBe(null);
  });
});
