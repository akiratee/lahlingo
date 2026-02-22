// Simple Mandarin POC to test voice matching
// Tests that browser speech recognition + Levenshtein matching works with Chinese characters

interface TestResult {
  target: string;
  spoken: string | null;
  matchPercentage: number;
  error?: string;
}

// Test phrases in Chinese (same as lesson content)
const MANDARIN_TEST_PHRASES = [
  { chinese: '你好', pinyin: 'ni hao', english: 'Hello' },
  { chinese: '谢谢', pinyin: 'xie xie', english: 'Thank you' },
  { chinese: '再见', pinyin: 'zai jian', english: 'Goodbye' },
  { chinese: '我爱你', pinyin: 'wo ai ni', english: 'I love you' },
  { chinese: '多少钱', pinyin: 'duo shao qian', english: 'How much?' },
];

// Levenshtein distance algorithm (same as in useSpeechRecognition.ts)
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Calculate match percentage between two Chinese strings
function calculateChineseMatch(spoken: string, target: string): number {
  const spokenNorm = spoken.trim();
  const targetNorm = target.trim();
  
  if (spokenNorm === targetNorm) return 100;
  
  if (spokenNorm.includes(targetNorm) || targetNorm.includes(spokenNorm)) {
    const overlap = Math.min(spokenNorm.length, targetNorm.length) / 
                    Math.max(spokenNorm.length, targetNorm.length);
    return Math.round(Math.max(60, overlap * 100));
  }
  
  const distance = levenshteinDistance(spokenNorm, targetNorm);
  const maxLength = Math.max(spokenNorm.length, targetNorm.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.round(Math.min(100, Math.max(10, similarity)));
}

// Test cases to verify the algorithm
export function runManualTests(): TestResult[] {
  const results: TestResult[] = [];
  
  // Test 1: Exact match
  results.push({
    target: '你好',
    spoken: '你好',
    matchPercentage: calculateChineseMatch('你好', '你好'),
  });
  
  // Test 2: Character substitution (1 char different)
  results.push({
    target: '你好',
    spoken: '您好',  // Similar character
    matchPercentage: calculateChineseMatch('您好', '你好'),
  });
  
  // Test 3: Different phrase
  results.push({
    target: '你好',
    spoken: '谢谢',
    matchPercentage: calculateChineseMatch('谢谢', '你好'),
  });
  
  // Test 4: Similar length, different characters
  results.push({
    target: '谢谢',
    spoken: '再见',
    matchPercentage: calculateChineseMatch('再见', '谢谢'),
  });
  
  return results;
}

// Export for testing
export { MANDARIN_TEST_PHRASES, calculateChineseMatch, levenshteinDistance };
