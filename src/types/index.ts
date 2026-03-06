// Type definitions for Dialect Master

export type Dialect = 'hokkien' | 'teochew' | 'cantonese' | 'hakka';

export type Tone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Level = 'beginner' | 'some' | 'conversational';

export interface UserProfile {
  id: string;
  name: string;
  selectedDialect: Dialect;
  dailyGoalMinutes: number;
  level: number;
  xp: number;
  streak: number;
  streakFreezes: number; // Number of streak freezes available
  longestStreak: number; // Track longest streak ever
  lastStudyDate: string | null;
  createdAt: string;
  quizStats?: QuizStats;
}

export interface Phrase {
  chinese: string;
  romanization: string;
  english: string;
  tone: Tone;
  audioUrl?: string;
}

export interface VocabularyItem {
  id: string;
  phrase: Phrase;
  notes?: string;
}

export interface DialogueLine {
  speaker: string;
  chinese: string;
  romanization: string;
  english: string;
  audioUrl?: string;
}

export interface Dialogue {
  id: string;
  title: string;
  lines: DialogueLine[];
}

export interface QuizQuestion {
  id: string;
  type: 'listening' | 'reading';
  question: string;
  options: string[];
  correctIndex: number;
  lessonId?: string;
  lessonTitle?: string;
}

export interface Lesson {
  id: string;
  dialect: Dialect;
  unit: number;
  lesson: number;
  title: string;
  subtitle: string;
  duration: string; // e.g., "5 minutes"
  vocabulary: VocabularyItem[];
  dialogue?: Dialogue;
  quiz: QuizQuestion[];
  culturalNote?: string;
  xpReward: number;
}

export interface Unit {
  id: string;
  dialect: Dialect;
  unit: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  xpEarned: number;
  completedAt: string;
  quizScore?: number;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
  condition: (progress: UserProgressState) => boolean;
}

export interface UserProgressState {
  profile: UserProfile;
  completedLessons: Record<string, UserProgress>;
  achievements: Record<string, boolean>;
  weeklyActivity: Record<string, number>; // date -> minutes studied
  triedDialects: Dialect[]; // Track which dialects user has tried
  quizStats?: QuizStats;
}

export interface QuizStats {
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
  xpEarned: number;
}

export interface LessonState {
  currentLesson: string | null;
  currentSection: 'vocabulary' | 'dialogue' | 'quiz' | 'complete';
  vocabularyIndex: number;
  quizAnswers: Record<string, number>;
}

// Design system types
export interface ToneConfig {
  label: string;
  color: string;
  bgColor: string;
  contour: string;
}

export const TONE_CONFIGS: Record<Tone, ToneConfig> = {
  1: { label: 'Tone 1', color: '#4CAF50', bgColor: 'bg-[#4CAF50]', contour: '═' },
  2: { label: 'Tone 2', color: '#2196F3', bgColor: 'bg-[#2196F3]', contour: '╱' },
  3: { label: 'Tone 3', color: '#F44336', bgColor: 'bg-[#F44336]', contour: '╲' },
  4: { label: 'Tone 4', color: '#00BCD4', bgColor: 'bg-[#00BCD4]', contour: '╲╱' },
  5: { label: 'Tone 5', color: '#9E9E9E', bgColor: 'bg-[#9E9E9E]', contour: '═' },
  6: { label: 'Tone 6', color: '#FF9800', bgColor: 'bg-[#FF9800]', contour: '╲_' },
  7: { label: 'Tone 7', color: '#673AB7', bgColor: 'bg-[#673AB7]', contour: '─┐' },
  8: { label: 'Tone 8', color: '#E91E63', bgColor: 'bg-[#E91E63]', contour: '╱═' },
};

export const DIALECT_INFO: Record<Dialect, { name: string; chinese: string; description: string }> = {
  hokkien: { name: 'Hokkien', chinese: '闽南话', description: 'Southern Min - Largest Chinese group in Singapore' },
  teochew: { name: 'Teochew', chinese: '潮州话', description: 'Chaoshan Min - Second largest Chinese group' },
  cantonese: { name: 'Cantonese', chinese: '粤语', description: 'Yue Chinese - Historic community in Singapore' },
  hakka: { name: 'Hakka', chinese: '客家话', description: 'Kejia - Significant minority in Singapore' },
};

export const LEVEL_INFO = {
  beginner: { label: "I'm a complete beginner", description: "I don't understand anything" },
  some: { label: "I can understand a little", description: "I grew up hearing it but can't speak much" },
  conversational: { label: "I know some basics", description: "Hello, thank you, etc." },
};
