// Lesson content for Hokkien Beginner Track
import { Lesson, Unit, Dialect } from '../types';

export const UNITS: Unit[] = [
  {
    id: 'hokkien-u1',
    dialect: 'hokkien',
    unit: 1,
    title: 'Greetings',
    description: 'Basic greetings and essentials',
    lessons: 5,
    duration: '25 minutes',
  },
  {
    id: 'hokkien-u2',
    dialect: 'hokkien',
    unit: 2,
    title: 'Numbers & Counting',
    description: 'Numbers 1-100, prices, market',
    lessons: 5,
    duration: '30 minutes',
  },
  {
    id: 'hokkien-u3',
    dialect: 'hokkien',
    unit: 3,
    title: 'Family',
    description: 'Family members and relationships',
    lessons: 6,
    duration: '35 minutes',
  },
];

export const LESSONS: Lesson[] = [
  // Unit 1: Greetings
  {
    id: 'hokkien-u1-l1',
    dialect: 'hokkien',
    unit: 1,
    lesson: 1,
    title: 'Basic Greetings',
    subtitle: 'Hello, Thank you',
    duration: '5 minutes • 7 phrases',
    xpReward: 50,
    vocabulary: [
      { id: 'h1-1', phrase: { chinese: '你好', romanization: 'lí-hó', english: 'Hello', tone: 2 }},
      { id: 'h1-2', phrase: { chinese: '食飽未?', romanization: 'chia̤h-bē-bē', english: 'Have you eaten?', tone: 7 }},
      { id: 'h1-3', phrase: { chinese: '去叨位?', romanization: 'khì-to-ūi', english: 'Where are you going?', tone: 5 }},
      { id: 'h1-4', phrase: { chinese: '好', romanization: 'hó', english: 'Good / Okay', tone: 3 }},
      { id: 'h1-5', phrase: { chinese: '毋好', romanization: 'm̄-hó', english: 'Not good', tone: 7 }},
      { id: 'h1-6', phrase: { chinese: '恬', romanization: 'tiām', english: 'Quiet / Silent', tone: 5 }},
      { id: 'h1-7', phrase: { chinese: '緊', romanization: 'kín', english: 'Fast / Quickly', tone: 2 }},
    ],
    dialogue: {
      id: 'd1',
      title: 'Meeting a Friend',
      lines: [
        { speaker: 'A', chinese: '你好!', romanization: 'lí-hó!', english: 'Hello!' },
        { speaker: 'B', chinese: '你好! 食飽未?', romanization: 'lí-hó! chia̤h-bē-bē?', english: 'Hello! Have you eaten?' },
        { speaker: 'A', chinese: '食飽啊，你呢?', romanization: 'chia̤h-bē-a, lí-ne?', english: 'I have, how about you?' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listening',
        question: "What does '你好' mean?",
        options: ['Goodbye', 'Hello', 'Thank you', 'Good morning'],
        correctIndex: 1,
      },
    ],
    culturalNote: "In Singapore, asking '食飽未?' (Have you eaten?) is not just about food — it's a way of showing care! Your auntie might force-feed you even if you say yes!",
  },
  {
    id: 'hokkien-u1-l2',
    dialect: 'hokkien',
    unit: 1,
    lesson: 2,
    title: 'Gratitude',
    subtitle: 'Thank you and responses',
    duration: '5 minutes • 6 phrases',
    xpReward: 50,
    vocabulary: [
      { id: 'h2-1', phrase: { chinese: '感謝', romanization: 'kám-siā', english: 'Thank you (formal)', tone: 3 }},
      { id: 'h2-2', phrase: { chinese: '多谢', romanization: 'to-siā', english: 'Thanks (casual)', tone: 1 }},
      { id: 'h2-3', phrase: { chinese: '免客氣', romanization: 'bián-kheh-khì', english: "Don't be客气", tone: 1 }},
      { id: 'h2-4', phrase: { chinese: 'sorry', romanization: 'sóh-lí', english: 'Sorry', tone: 1 }},
      { id: 'h2-5', phrase: { chinese: '原諒', romanization: 'goân-liōng', english: 'Excuse me / Forgive', tone: 5 }},
      { id: 'h2-6', phrase: { chinese: '無要緊', romanization: 'bô-iàu-kín', english: 'Never mind / It\'s okay', tone: 5 }},
    ],
    quiz: [
      {
        id: 'q2',
        type: 'listening',
        question: "Which phrase means 'Thank you' informally?",
        options: ['感謝', '多谢', '恬', '好'],
        correctIndex: 1,
      },
    ],
    culturalNote: "In informal situations, '多谢' (to-siā) is more commonly used than the formal '感謝'. Using the right level of politeness shows respect!",
  },
  {
    id: 'hokkien-u1-l3',
    dialect: 'hokkien',
    unit: 1,
    lesson: 3,
    title: 'Getting Attention',
    subtitle: 'Calling someone',
    duration: '5 minutes • 5 phrases',
    xpReward: 50,
    vocabulary: [
      { id: 'h3-1', phrase: { chinese: '喂', romanization: 'wê / óh', english: 'Hey (phone)', tone: 2 }},
      { id: 'h3-2', phrase: { chinese: '恁爸', romanization: 'lín-pē', english: 'Hey (casual, male)', tone: 2 }},
      { id: 'h3-3', phrase: { chinese: '小姐', romanization: 'siáu-chiá', english: 'Miss / Young lady', tone: 3 }},
      { id: 'h3-4', phrase: { chinese: '先生', romanization: 'sian-sinn', english: 'Mister / Sir', tone: 1 }},
      { id: 'h3-5', phrase: { chinese: '朋友', romanization: 'pêng-iú', english: 'Friend', tone: 5 }},
    ],
    quiz: [
      {
        id: 'q3',
        type: 'listening',
        question: "Which is appropriate for a young woman?",
        options: ['恁爸', '小姐', '先生', '喂'],
        correctIndex: 1,
      },
    ],
    culturalNote: "In Singapore, it's common to use 'Uncle' (阿叔) and 'Auntie' (阿嫂) to respectfully address older strangers, even hawkers!",
  },
  {
    id: 'hokkien-u1-l4',
    dialect: 'hokkien',
    unit: 1,
    lesson: 4,
    title: 'Farewells',
    subtitle: 'Goodbye expressions',
    duration: '5 minutes • 5 phrases',
    xpReward: 50,
    vocabulary: [
      { id: 'h4-1', phrase: { chinese: '再見', romanization: 'chài-kiàn', english: 'Goodbye', tone: 5 }},
      { id: 'h4-2', phrase: { chinese: '明仔見', romanization: 'miâ-á-kìⁿ', english: 'See you tomorrow', tone: 1 }},
      { id: 'h4-3', phrase: { chinese: '慢走', romanization: 'bān-cháu', english: 'Take care (when leaving)', tone: 6 }},
      { id: 'h4-4', phrase: { chinese: '下次見', romanization: 'hē-chhù-kìⁿ', english: 'See you next time', tone: 5 }},
      { id: 'h4-5', phrase: { chinese: '拜拜', romanization: 'pài-pài', english: 'Bye bye', tone: 3 }},
    ],
    quiz: [
      {
        id: 'q4',
        type: 'listening',
        question: "What do you say when you're leaving and want someone to take care?",
        options: ['再見', '慢走', '明仔見', '拜拜'],
        correctIndex: 1,
      },
    ],
    culturalNote: "'拜拜' is the Hokkien adaptation of English 'bye-bye' and is commonly used among younger Singaporeans!",
  },
  {
    id: 'hokkien-u1-l5',
    dialect: 'hokkien',
    unit: 1,
    lesson: 5,
    title: 'Unit Review',
    subtitle: 'Test your knowledge',
    duration: '5 minutes',
    xpReward: 100,
    vocabulary: [],
    quiz: [
      {
        id: 'q5-1',
        type: 'listening',
        question: "How do you say 'Hello' in Hokkien?",
        options: ['再見', '你好', '感謝', '好'],
        correctIndex: 1,
      },
      {
        id: 'q5-2',
        type: 'listening',
        question: "What does '食飽未?' mean?",
        options: ['Where are you going?', 'Thank you', 'Have you eaten?', 'Goodbye'],
        correctIndex: 2,
      },
      {
        id: 'q5-3',
        type: 'reading',
        question: "Choose the formal thank you:",
        options: ['多谢', '感謝', '恬', '毋好'],
        correctIndex: 1,
      },
    ],
    culturalNote: "Congratulations on completing Unit 1! You've learned the basics of greeting someone in Hokkien. Practice these phrases with family or friends!",
  },
];

// Helper functions
export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find(l => l.id === id);
}

export function getLessonsByUnit(dialect: Dialect, unit: number): Lesson[] {
  return LESSONS.filter(l => l.dialect === dialect && l.unit === unit);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find(u => u.id === id);
}

export function getNextLesson(currentLessonId: string): Lesson | null {
  const currentIndex = LESSONS.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === LESSONS.length - 1) return null;
  return LESSONS[currentIndex + 1];
}
