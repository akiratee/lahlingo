// Speech recognition for pronunciation practice using Web Speech API
// Note: These types need to be declared in global scope for Web Speech API

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface PronunciationScore {
  transcript: string;
  targetPhrase: string;
  similarity: number; // 0-100
  isMatch: boolean;
  feedback: string;
}

// Check if Speech Recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

// Get the Speech Recognition API
function getSpeechRecognition(): any { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SpeechRecognition ? new SpeechRecognition() : null;
}

// Calculate similarity between two strings (simple Levenshtein-based)
function calculateSimilarity(transcript: string, target: string): number {
  const t = transcript.toLowerCase().trim();
  const g = target.toLowerCase().trim();
  
  if (t === g) return 100;
  if (t.length === 0 || g.length === 0) return 0;
  
  // Simple character-based similarity
  const longer = t.length > g.length ? t : g;
  const shorter = t.length > g.length ? g : t;
  
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) {
      matches++;
    }
  }
  
  return Math.round((matches / longer.length) * 100);
}

// Generate feedback based on similarity score
function generateFeedback(similarity: number, target: string): string {
  if (similarity >= 90) {
    return 'Perfect! 🎉';
  } else if (similarity >= 70) {
    return 'Great job! Keep practicing.';
  } else if (similarity >= 50) {
    return 'Good try! Try to match the pronunciation more closely.';
  } else if (similarity >= 30) {
    return 'Keep trying! Listen carefully and try again.';
  } else {
    return `Try saying: "${target}"`;
  }
}

// Compare spoken text with target phrase
export function scorePronunciation(transcript: string, targetPhrase: string): PronunciationScore {
  const similarity = calculateSimilarity(transcript, targetPhrase);
  const isMatch = similarity >= 70; // 70% threshold for a "match"
  
  return {
    transcript,
    targetPhrase,
    similarity,
    isMatch,
    feedback: generateFeedback(similarity, targetPhrase),
  };
}

// Create a speech recognition session
export function createSpeechRecognitionSession(
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void; abort: () => void } | null {
  const recognition = getSpeechRecognition();
  
  if (!recognition) {
    onError('Speech recognition not supported in this browser');
    return null;
  }
  
  // Configure recognition
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;
  
  // Set language based on dialect
  // Note: Web Speech API has limited dialect support
  // For Chinese dialects, we use 'zh-CN' as closest approximation
  recognition.lang = 'zh-CN';
  
  // Handle results
  recognition.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const results = event.results;
    const lastResult = results[results.length - 1];
    
    const result: SpeechRecognitionResult = {
      transcript: lastResult[0].transcript,
      confidence: lastResult[0].confidence,
      isFinal: lastResult.isFinal,
    };
    
    onResult(result);
  };
  
  // Handle errors
  recognition.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    let errorMessage = 'Unknown error';
    
    switch (event.error) {
      case 'no-speech':
        errorMessage = 'No speech detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage = 'No microphone found. Please check your microphone.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone access denied. Please allow microphone access.';
        break;
      case 'network':
        errorMessage = 'Network error. Please check your connection.';
        break;
      default:
        errorMessage = `Error: ${event.error}`;
    }
    
    onError(errorMessage);
  };
  
  // Handle end
  recognition.onend = () => {
    onEnd();
  };
  
  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        onError('Failed to start recognition');
      }
    },
    stop: () => {
      recognition.stop();
    },
    abort: () => {
      recognition.abort();
    },
  };
}

// Dialect to language code mapping
export const DIALECT_LANGUAGE_MAP: Record<string, string> = {
  hokkien: 'zh-CN',
  teochew: 'zh-CN',
  cantonese: 'zh-CN',
  hakka: 'zh-CN',
  mandarin: 'zh-CN',
};

// Get language code for a dialect
export function getLanguageForDialect(dialect: string): string {
  return DIALECT_LANGUAGE_MAP[dialect] || 'zh-CN';
}
