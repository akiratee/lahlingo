// TTS Provider Configuration
export type TTSProvider = 'browser' | 'openai';

export interface TTSConfig {
  provider: TTSProvider;
  voice?: string;
  speed?: number;
}

export const DEFAULT_TTS_CONFIG: TTSConfig = {
  provider: 'browser',
  speed: 0.8,
};

// Browser TTS function
export function browserTTS(text: string, speed: number = 0.8): void {
  if (!window.speechSynthesis) {
    throw new Error('Speech synthesis not supported');
  }
  
  window.speechSynthesis.cancel();
  
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-TW';
  utter.rate = speed;
  utter.pitch = 1;
  utter.volume = 1;
  
  // Try to find a Chinese/Taiwan voice
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(v => 
    v.lang.includes('zh') || v.lang.includes('Chinese')
  );
  if (chineseVoice) {
    utter.voice = chineseVoice;
  }
  
  window.speechSynthesis.speak(utter);
}

// Get stored TTS config
export function getTTSConfig(): TTSConfig {
  if (typeof window === 'undefined') return DEFAULT_TTS_CONFIG;
  
  const stored = localStorage.getItem('ttsConfig');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_TTS_CONFIG;
    }
  }
  return DEFAULT_TTS_CONFIG;
}

// Save TTS config
export function saveTTSConfig(config: TTSConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ttsConfig', JSON.stringify(config));
}
