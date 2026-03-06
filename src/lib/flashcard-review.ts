// Flashcard review system for spaced repetition
import { getStoredProgress, getStoredProfile } from './progress';
import { getLessonById, LESSONS } from './lessons';
import { VocabularyItem, UserProgress, Dialect } from '../types';

export interface FlashCard {
  id: string;
  phrase: {
    chinese: string;
    romanization: string;
    english: string;
    tone: number;
  };
  lessonId: string;
  lessonTitle: string;
  dialect: Dialect;
  // Spaced repetition fields
  nextReview: number; // timestamp
  easeFactor: number; // difficulty multiplier
  interval: number; // days until next review
  reviews: number; // times reviewed
}

const STORAGE_KEY = 'dialect-master-flashcards';

// Default spaced repetition values
const DEFAULT_EASE_FACTOR = 2.5;
const DEFAULT_INTERVAL = 1; // 1 day

export function getFlashcards(): FlashCard[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveFlashcards(cards: FlashCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// Get cards due for review
export function getDueCards(): FlashCard[] {
  const cards = getFlashcards();
  const now = Date.now();
  return cards.filter(card => card.nextReview <= now);
}

// Get all cards for a specific dialect
export function getCardsByDialect(dialect: Dialect): FlashCard[] {
  const cards = getFlashcards();
  return cards.filter(card => card.dialect === dialect);
}

// Add new flashcards from a completed lesson
export function addLessonFlashcards(lessonId: string): FlashCard[] {
  const lesson = getLessonById(lessonId);
  if (!lesson) return [];

  const existingCards = getFlashcards();
  const existingIds = new Set(existingCards.map(c => c.id));

  const newCards: FlashCard[] = lesson.vocabulary
    .filter((v: VocabularyItem) => !existingIds.has(v.id))
    .map((v: VocabularyItem) => ({
      id: v.id,
      phrase: v.phrase,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      dialect: lesson.dialect,
      nextReview: Date.now(), // Due immediately
      easeFactor: DEFAULT_EASE_FACTOR,
      interval: DEFAULT_INTERVAL,
      reviews: 0,
    }));

  if (newCards.length > 0) {
    saveFlashcards([...existingCards, ...newCards]);
  }

  return newCards;
}

// Process a review response and update card scheduling
export function reviewCard(
  cardId: string,
  quality: number // 0-5: 0=forgot, 1-2=hard, 3=good, 4-5=easy
): FlashCard | null {
  const cards = getFlashcards();
  const cardIndex = cards.findIndex(c => c.id === cardId);
  
  if (cardIndex === -1) return null;

  const card = cards[cardIndex];
  let { easeFactor, interval } = card;

  // SM-2 algorithm simplified
  if (quality < 3) {
    // Failed - reset
    interval = 1;
  } else {
    // Passed - increase interval
    if (card.reviews === 0) {
      interval = 1;
    } else if (card.reviews === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  // Calculate next review time
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  const updatedCard: FlashCard = {
    ...card,
    easeFactor,
    interval,
    nextReview,
    reviews: card.reviews + 1,
  };

  cards[cardIndex] = updatedCard;
  saveFlashcards(cards);

  return updatedCard;
}

// Get review statistics
export function getReviewStats(): {
  total: number;
  due: number;
  learned: number;
  mastery: number;
} {
  const cards = getFlashcards();
  const now = Date.now();
  
  return {
    total: cards.length,
    due: cards.filter(c => c.nextReview <= now).length,
    learned: cards.filter(c => c.reviews > 0).length,
    mastery: cards.filter(c => c.interval >= 21).length, // 3+ weeks = mastered
  };
}

// Reset all flashcards (for testing)
export function resetFlashcards(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
