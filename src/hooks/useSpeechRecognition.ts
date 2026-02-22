// Custom hooks for speech recognition and audio
import { useState, useCallback, useEffect } from 'react';
import { getTTSConfig, browserTTS } from '@/lib/tts';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  matchPercentage: number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  result: SpeechRecognitionResult | null;
  error: string | null;
  start: () => void;
  stop: () => void;
  supportCheck: () => boolean;
}

// Try multiple language codes for better dialect recognition
const RECOGNITION_LANGS = ['zh-TW', 'zh-Hant', 'zh-Hans', 'zh-CN', 'zh-SG'];

export function useSpeechRecognition(
  targetPhrase: string
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      // Try to find the best matching language
      let selectedLang = 'zh-TW';
      
      for (const lang of RECOGNITION_LANGS) {
        try {
          const testRec = new SpeechRecognition();
          testRec.lang = lang;
          selectedLang = lang;
          break;
        } catch {
          continue;
        }
      }
      
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = selectedLang;
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        // Calculate match percentage with multiple strategies
        const matchPercentage = calculateMatchFlexible(transcript, targetPhrase);
        
        setResult({
          transcript,
          confidence,
          matchPercentage,
        });
        setIsListening(false);
      };
      
      rec.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(rec);
    }
  }, [targetPhrase]);

  const start = useCallback(() => {
    setError(null);
    setResult(null);
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        setError('Recognition already started');
      }
    } else {
      setError('Speech recognition not supported - using mock');
      setTimeout(() => {
        const mockPercentage = Math.floor(Math.random() * 30) + 65;
        setResult({
          transcript: targetPhrase,
          confidence: 0.9,
          matchPercentage: mockPercentage,
        });
        setIsListening(false);
      }, 2000);
    }
  }, [recognition, targetPhrase]);

  const stop = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, [recognition]);

  const supportCheck = useCallback(() => {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }, []);

  return {
    isListening,
    result,
    error,
    start,
    stop,
    supportCheck,
  };
}

// Flexible matching algorithm for dialect romanization
function calculateMatchFlexible(spoken: string, target: string): number {
  const spokenNorm = spoken.toLowerCase().trim();
  const targetNorm = target.toLowerCase().trim();
  
  if (spokenNorm === targetNorm) return 100;
  
  if (spokenNorm.includes(targetNorm) || targetNorm.includes(spokenNorm)) {
    const overlap = Math.min(spokenNorm.length, targetNorm.length) / 
                    Math.max(spokenNorm.length, targetNorm.length);
    return Math.round(Math.max(60, overlap * 100));
  }
  
  const spokenChars = spokenNorm.replace(/[0-9]/g, '');
  const targetChars = targetNorm.replace(/[0-9]/g, '');
  
  if (spokenChars === targetChars) return 95;
  
  const spokenWords = spokenNorm.split(/\s+/);
  const targetWords = targetNorm.split(/\s+/);
  
  let matchedWords = 0;
  for (const tWord of targetWords) {
    for (const sWord of spokenWords) {
      if (sWord.includes(tWord) || tWord.includes(sWord)) {
        matchedWords++;
        break;
      }
    }
  }
  
  if (targetWords.length > 0) {
    const wordMatch = (matchedWords / targetWords.length) * 100;
    return Math.round(Math.max(20, wordMatch));
  }
  
  const distance = levenshteinDistance(spokenNorm, targetNorm);
  const maxLength = Math.max(spokenNorm.length, targetNorm.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.round(Math.min(100, Math.max(10, similarity)));
}

// Chinese character matching (for Mandarin POC)
export function calculateChineseMatch(spoken: string, target: string): number {
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

// Audio playback hook (browser TTS only)
interface UseAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  play: (text?: string) => Promise<void>;
  stop: () => void;
  error: string | null;
}

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(async (text?: string) => {
    if (!text) return;
    
    setError(null);
    setIsLoading(true);
    setIsPlaying(true);
    
    try {
      const config = getTTSConfig();
      browserTTS(text, config.speed || 0.8);
      
      setTimeout(() => {
        setIsPlaying(false);
        setIsLoading(false);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  return {
    isPlaying,
    isLoading,
    play,
    stop,
    error,
  };
}
