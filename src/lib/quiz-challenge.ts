// Quiz Challenge - Quick assessment from completed lessons
import { getStoredProgress, getStoredProfile, saveProfile } from './progress';
import { getLessonById } from './lessons';
import { QuizQuestion, UserProfile } from '../types';

export interface QuizChallengeResult {
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  lessonIds: string[];
}

export interface QuizChallengeState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  startTime: number;
  lessonIds: string[];
}

/**
 * Generate a quiz challenge from completed lessons
 * @param maxQuestions - Maximum number of questions (default 10)
 * @returns Array of quiz questions or null if no completed lessons
 */
export function generateQuizChallenge(maxQuestions: number = 10): QuizQuestion[] | null {
  const progress = getStoredProgress();
  
  if (!progress) {
    return null;
  }

  // Get completed lesson IDs
  const completedLessons: string[] = [];
  for (const [lessonId, lessonProgress] of Object.entries(progress)) {
    if (lessonProgress.completed) {
      completedLessons.push(lessonId);
    }
  }
  
  if (completedLessons.length === 0) {
    return null;
  }

  // Collect all quiz questions from completed lessons
  const allQuestions: QuizQuestion[] = [];
  
  for (const lessonId of completedLessons) {
    const lesson = getLessonById(lessonId);
    if (lesson && lesson.quiz && lesson.quiz.length > 0) {
      for (const question of lesson.quiz) {
        allQuestions.push({
          ...question,
          lessonId: lessonId,
          lessonTitle: lesson.title,
        });
      }
    }
  }

  if (allQuestions.length === 0) {
    return null;
  }

  // Shuffle and limit questions
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, Math.min(maxQuestions, shuffled.length));
}

/**
 * Get the number of available quiz questions from completed lessons
 */
export function getAvailableQuizCount(): number {
  const progress = getStoredProgress();
  
  if (!progress) {
    return 0;
  }

  // Get completed lesson IDs
  const completedLessons: string[] = [];
  for (const [lessonId, lessonProgress] of Object.entries(progress)) {
    if (lessonProgress.completed) {
      completedLessons.push(lessonId);
    }
  }
  
  if (completedLessons.length === 0) {
    return 0;
  }

  let count = 0;
  for (const lessonId of completedLessons) {
    const lesson = getLessonById(lessonId);
    if (lesson && lesson.quiz) {
      count += lesson.quiz.length;
    }
  }

  return count;
}

/**
 * Check an answer and return whether it's correct
 */
export function checkQuizAnswer(
  question: QuizQuestion, 
  answerIndex: number
): boolean {
  return question.correctIndex === answerIndex;
}

/**
 * Calculate XP earned from quiz results
 */
export function calculateQuizXP(correct: number, total: number): number {
  // Base XP: 5 per question
  const baseXP = correct * 5;
  
  // Bonus for perfect score
  const perfectBonus = correct === total ? total * 5 : 0;
  
  // Partial bonus for high scores (80%+)
  const accuracy = correct / total;
  const highScoreBonus = accuracy >= 0.8 ? Math.floor(total * 2) : 0;
  
  return baseXP + perfectBonus + highScoreBonus;
}

/**
 * Save quiz challenge result to profile
 */
export function saveQuizResult(result: QuizChallengeResult): void {
  const profile = getStoredProfile();
  if (!profile) return;
  
  // Initialize quiz stats if not present
  const quizStats = profile.quizStats || {
    totalQuizzes: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestStreak: 0,
    xpEarned: 0,
  };
  
  // Update stats
  quizStats.totalQuizzes += 1;
  quizStats.totalCorrect += result.correctAnswers;
  quizStats.totalQuestions += result.totalQuestions;
  quizStats.xpEarned += result.xpEarned;
  
  // Update best streak if applicable
  if (result.correctAnswers > quizStats.bestStreak) {
    quizStats.bestStreak = result.correctAnswers;
  }
  
  // Save to profile
  saveProfile({
    ...profile,
    quizStats,
  });
}

/**
 * Get quiz statistics from profile
 */
export function getQuizStats(): {
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
  xpEarned: number;
  averageAccuracy: number;
} {
  const profile = getStoredProfile();
  
  if (!profile || !profile.quizStats) {
    return {
      totalQuizzes: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      bestStreak: 0,
      xpEarned: 0,
      averageAccuracy: 0,
    };
  }
  
  const { quizStats } = profile;
  const averageAccuracy = quizStats.totalQuestions > 0 
    ? Math.round((quizStats.totalCorrect / quizStats.totalQuestions) * 100)
    : 0;
  
  return {
    ...quizStats,
    averageAccuracy,
  };
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
