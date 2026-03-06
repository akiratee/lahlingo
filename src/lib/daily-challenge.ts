// Daily Challenge feature - special daily quiz with bonus XP and rotating dialect focus
import { Dialect, QuizQuestion, UserProgressState } from '../types';
import { getStoredProfile, getStoredProgress } from './progress';

// Challenge types
export type ChallengeType = 'vocabulary' | 'listening' | 'tones' | 'mixed';

export interface DailyChallenge {
  date: string;
  dialect: Dialect;
  type: ChallengeType;
  title: string;
  description: string;
  xpBonus: number;
  questions: QuizQuestion[];
}

// Get today's date string
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get day of year for rotation (0-365)
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Get rotating dialect based on date
export function getChallengeDialect(): Dialect {
  const dayOfYear = getDayOfYear();
  const dialects: Dialect[] = ['hokkien', 'teochew', 'cantonese', 'hakka'];
  return dialects[dayOfYear % 4];
}

// Get rotating challenge type based on date
export function getChallengeType(): ChallengeType {
  const dayOfYear = getDayOfYear();
  const types: ChallengeType[] = ['vocabulary', 'listening', 'tones', 'mixed'];
  return types[dayOfYear % 4];
}

// Check if user has completed today's challenge
export function hasCompletedTodayChallenge(): boolean {
  const profile = getStoredProfile();
  if (!profile) return false;
  
  const today = getTodayDateString();
  return profile.lastDailyChallenge === today;
}

// Get or create today's daily challenge
export function getDailyChallenge(): DailyChallenge {
  const dialect = getChallengeDialect();
  const type = getChallengeType();
  const today = getTodayDateString();
  
  const challengeTitles: Record<ChallengeType, { title: string; description: string }> = {
    vocabulary: { title: 'Vocabulary Builder', description: 'Test your vocabulary knowledge' },
    listening: { title: 'Ear Training', description: 'Practice your listening skills' },
    tones: { title: 'Tone Master', description: 'Master the tones' },
    mixed: { title: 'Mixed Challenge', description: 'A bit of everything!' },
  };
  
  const titles = challengeTitles[type];
  
  // Generate questions based on type
  const questions = generateChallengeQuestions(dialect, type);
  
  return {
    date: today,
    dialect,
    type,
    title: titles.title,
    description: titles.description,
    xpBonus: 50 + (type === 'mixed' ? 25 : 0), // Extra bonus for mixed
    questions,
  };
}

// Generate challenge questions based on dialect and type
function generateChallengeQuestions(dialect: Dialect, type: ChallengeType): QuizQuestion[] {
  // Sample vocabulary by dialect
  const vocabularyByDialect: Record<Dialect, Array<{ chinese: string; romanization: string; english: string; tone: number }>> = {
    hokkien: [
      { chinese: '吃', romanization: 'jia', english: 'eat', tone: 1 },
      { chinese: '喝', romanization: 'lim', english: 'drink', tone: 2 },
      { chinese: '去', romanization: 'ki', english: 'go', tone: 3 },
      { chinese: '来', romanization: 'lai', english: 'come', tone: 4 },
      { chinese: '好', romanization: 'ho', english: 'good', tone: 2 },
      { chinese: '无', romanization: 'bo', english: 'no/not have', tone: 5 },
      { chinese: '有', romanization: 'u', english: 'have', tone: 6 },
      { chinese: '这', romanization: 'tsit', english: 'this', tone: 7 },
      { chinese: '那', romanization: 'hit', english: 'that', tone: 8 },
      { chinese: '人', romanization: 'lang', english: 'person', tone: 5 },
    ],
    teochew: [
      { chinese: '吃', romanization: 'cia', english: 'eat', tone: 1 },
      { chinese: '喝', romanization: 'nang', english: 'drink', tone: 2 },
      { chinese: '去', romanization: 'kou', english: 'go', tone: 3 },
      { chinese: '来', romanization: 'lai', english: 'come', tone: 5 },
      { chinese: '好', romanization: 'ho', english: 'good', tone: 2 },
      { chinese: '无', romanization: 'bho', english: 'no/not have', tone: 5 },
      { chinese: '有', romanization: 'u', english: 'have', tone: 6 },
      { chinese: '这', romanization: 'zi', english: 'this', tone: 6 },
      { chinese: '那', romanization: 'he', english: 'that', tone: 6 },
      { chinese: '人', romanization: 'nang', english: 'person', tone: 5 },
    ],
    cantonese: [
      { chinese: '食', romanization: 'sik6', english: 'eat', tone: 6 },
      { chinese: '饮', romanization: 'jam2', english: 'drink', tone: 2 },
      { chinese: '去', romanization: 'heoi3', english: 'go', tone: 3 },
      { chinese: '来', romanization: 'lai4', english: 'come', tone: 4 },
      { chinese: '好', romanization: 'hou2', english: 'good', tone: 2 },
      { chinese: '冇', romanization: 'mou5', english: 'no/not have', tone: 5 },
      { chinese: '有', romanization: 'jau5', english: 'have', tone: 5 },
      { chinese: '呢', romanization: 'ni1', english: 'this', tone: 1 },
      { chinese: '嗰', romanization: 'go2', english: 'that', tone: 2 },
      { chinese: '人', romanization: 'jan4', english: 'person', tone: 4 },
    ],
    hakka: [
      { chinese: '食', romanization: 'shid', english: 'eat', tone: 5 },
      { chinese: '啉', romanization: 'lim', english: 'drink', tone: 2 },
      { chinese: '去', romanization: 'hi', english: 'go', tone: 3 },
      { chinese: '來', romanization: 'loi', english: 'come', tone: 4 },
      { chinese: '好', romanization: 'ho', english: 'good', tone: 2 },
      { chinese: '無', romanization: 'mo', english: 'no/not have', tone: 4 },
      { chinese: '有', romanization: 'yu', english: 'have', tone: 4 },
      { chinese: '這', romanization: 'ia', english: 'this', tone: 2 },
      { chinese: '那', romanization: 'a', english: 'that', tone: 2 },
      { chinese: '人', romanization: 'ngin', english: 'person', tone: 4 },
    ],
  };
  
  const vocab = vocabularyByDialect[dialect];
  const questions: QuizQuestion[] = [];
  
  if (type === 'vocabulary' || type === 'mixed') {
    // Add vocabulary questions
    for (let i = 0; i < 3; i++) {
      const idx = i % vocab.length;
      const correct = vocab[idx];
      const others = vocab.filter((_, j) => j !== idx).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correct, ...others].sort(() => Math.random() - 0.5);
      
      questions.push({
        id: `vocab-${i}`,
        type: 'reading',
        question: `What does "${correct.chinese}" mean?`,
        options: options.map(o => o.english),
        correctIndex: options.findIndex(o => o.english === correct.english),
        lessonId: 'daily-challenge',
        lessonTitle: 'Daily Challenge',
      });
    }
  }
  
  if (type === 'listening' || type === 'mixed') {
    // Add listening questions (using romanization as proxy)
    for (let i = 0; i < 2; i++) {
      const idx = (i + 3) % vocab.length;
      const correct = vocab[idx];
      const others = vocab.filter((_, j) => j !== idx).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correct, ...others].sort(() => Math.random() - 0.5);
      
      questions.push({
        id: `listen-${i}`,
        type: 'listening',
        question: `Select the meaning of: ${correct.romanization}`,
        options: options.map(o => o.english),
        correctIndex: options.findIndex(o => o.english === correct.english),
        lessonId: 'daily-challenge',
        lessonTitle: 'Daily Challenge',
      });
    }
  }
  
  if (type === 'tones' || type === 'mixed') {
    // Add tone questions
    const toneVocab = vocab.slice(0, 5);
    for (let i = 0; i < toneVocab.length; i++) {
      const correct = toneVocab[i];
      const toneOptions = ['Tone 1', 'Tone 2', 'Tone 3', 'Tone 4', 'Tone 5', 'Tone 6', 'Tone 7', 'Tone 8'];
      const correctTone = `Tone ${correct.tone}`;
      
      questions.push({
        id: `tone-${i}`,
        type: 'listening',
        question: `What tone is "${correct.romanization}" (${correct.english})?`,
        options: toneOptions,
        correctIndex: correct.tone - 1,
        lessonId: 'daily-challenge',
        lessonTitle: 'Daily Challenge',
      });
    }
  }
  
  return questions.slice(0, 10); // Max 10 questions
}

// Mark today's challenge as completed
export function markChallengeCompleted(score: number): { xpEarned: number; newStreak: boolean } {
  const profile = getStoredProfile();
  if (!profile) return { xpEarned: 0, newStreak: false };
  
  const challenge = getDailyChallenge();
  const today = getTodayDateString();
  
  // Calculate XP earned (base + bonus for good score)
  const baseXP = 25;
  const scoreBonus = Math.floor((score / 100) * 25);
  const xpEarned = baseXP + scoreBonus + challenge.xpBonus;
  
  // Check if this extends streak
  let newStreak = false;
  if (profile.lastStudyDate) {
    const lastDate = new Date(profile.lastStudyDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day - extend streak
      newStreak = true;
    }
  } else {
    // First study ever
    newStreak = true;
  }
  
  // Update profile
  const newXP = (profile.xp || 0) + xpEarned;
  const newStreakCount = newStreak ? (profile.streak || 0) + 1 : 1;
  const newLevel = Math.floor(newXP / 100) + 1;
  
  profile.xp = newXP;
  profile.streak = newStreakCount;
  profile.level = newLevel;
  if (newStreakCount > (profile.longestStreak || 0)) {
    profile.longestStreak = newStreakCount;
  }
  profile.lastStudyDate = today;
  profile.lastDailyChallenge = today;
  
  localStorage.setItem('lahlingo_profile', JSON.stringify(profile));
  
  return { xpEarned, newStreak };
}

// Get challenge streak (consecutive days completed)
export function getChallengeStreak(): number {
  const progress = getStoredProgress();
  if (!progress) return 0;
  
  // This would need to track daily challenge completion separately
  // For now, return 0 as we track via profile.lastDailyChallenge
  return 0;
}

// Get time until next challenge
export function getTimeUntilNextChallenge(): { hours: number; minutes: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes };
}
