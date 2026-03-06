// Quick Review - Spaced repetition vocabulary practice
import { LESSONS, getLessonById } from './lessons';
import { getStoredProgress } from './progress';
import { QuizQuestion } from '../types';

// Get vocabulary from recently completed lessons for review
export function getRecentlyCompletedVocabulary(): { lessonId: string; vocabulary: any[] }[] {
  const progress = getStoredProgress();
  if (!progress) return [];

  // Get lessons that have been completed
  const completedLessons = Object.entries(progress)
    .filter(([_, p]) => p.completed)
    .map(([lessonId, _]) => lessonId);

  if (completedLessons.length === 0) {
    // If no lessons completed, return vocabulary from first few lessons
    return LESSONS.slice(0, 3).map(lesson => ({
      lessonId: lesson.id,
      vocabulary: lesson.vocabulary || []
    }));
  }

  // Get vocabulary from completed lessons (up to 5 lessons)
  return completedLessons.slice(0, 5).map(lessonId => {
    const lesson = getLessonById(lessonId);
    return {
      lessonId,
      vocabulary: lesson?.vocabulary || []
    };
  }).filter(item => item.vocabulary.length > 0);
}

// Generate quick review questions (5 questions)
export function generateQuickReviewQuestions(count: number = 5): QuizQuestion[] {
  const lessonVocabs = getRecentlyCompletedVocabulary();
  
  // Flatten all vocabulary
  const allVocab: { id: string; phrase: any; lessonId: string }[] = [];
  lessonVocabs.forEach(lv => {
    lv.vocabulary.forEach((v: any) => {
      allVocab.push({ ...v, lessonId: lv.lessonId });
    });
  });

  if (allVocab.length === 0) {
    return [];
  }

  const questions: QuizQuestion[] = [];
  const usedVocab = new Set<string>();

  for (let i = 0; i < Math.min(count, allVocab.length); i++) {
    // Pick a random vocabulary item not yet used
    let availableVocab = allVocab.filter(v => !usedVocab.has(v.id));
    if (availableVocab.length === 0) availableVocab = allVocab;
    
    const randomIndex = Math.floor(Math.random() * availableVocab.length);
    const vocab = availableVocab[randomIndex];
    usedVocab.add(vocab.id);

    // Generate wrong answers from other vocabulary
    const wrongAnswers = allVocab
      .filter(v => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.phrase.english);

    // Create question options (shuffle correct + wrong)
    const options = [vocab.phrase.english, ...wrongAnswers].slice(0, 4);
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(vocab.phrase.english);

    questions.push({
      id: `quick-review-${i}`,
      type: 'reading',
      question: `What does "${vocab.phrase.romanization}" mean?`,
      options: shuffledOptions,
      correctIndex,
      lessonId: vocab.lessonId,
    });
  }

  return questions;
}

// Get count of available vocabulary for quick review
export function getQuickReviewVocabularyCount(): number {
  const lessonVocabs = getRecentlyCompletedVocabulary();
  return lessonVocabs.reduce((sum, lv) => sum + lv.vocabulary.length, 0);
}

// Check answer for quick review
export function checkQuickReviewAnswer(question: QuizQuestion, answerIndex: number): boolean {
  return answerIndex === question.correctIndex;
}

// Calculate XP for quick review
export function calculateQuickReviewXP(correctCount: number, totalCount: number): number {
  const baseXP = 10; // Base XP for completing
  const bonusXP = correctCount * 5; // 5 XP per correct answer
  return baseXP + bonusXP;
}
