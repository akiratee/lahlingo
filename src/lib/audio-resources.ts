// Audio Resources - Map phrases to authentic Hokkien recordings
// PRD: Developer Mode & Audio Resources

export interface AudioResource {
  phraseId: string;
  chinese: string;
  romanization: string;
  speaker: string;
  region: string;
  audioUrl: string;
  status: 'available' | 'coming_soon' | 'needs_review';
}

// Map lesson phrases to audio recordings
// Format: {dialect}-{unit}-lesson{lessonNumber}-phrase{phraseIndex}
export const AUDIO_RESOURCES: AudioResource[] = [
  // Unit 1: Greetings - Coming soon (Vincent's family recordings)
  {
    phraseId: 'h1-1',
    chinese: '你好',
    romanization: 'lí-hó',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/liho.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h1-2',
    chinese: '食飽未?',
    romanization: 'chia̤h-bē-bē',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/chiabe.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h1-3',
    chinese: '去叨位?',
    romanization: 'khì-to-ūi',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/khitoui.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h1-4',
    chinese: '好',
    romanization: 'hó',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/ho.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h1-5',
    chinese: '毋好',
    romanization: 'm̄-hó',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/mho.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h1-6',
    chinese: '恬',
    romanization: 'tiām',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/tiam.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h1-7',
    chinese: '緊',
    romanization: 'kín',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/kin.mp3',
    status: 'coming_soon',
  },
  // Unit 1 Lesson 2: Gratitude
  {
    phraseId: 'h2-1',
    chinese: '感謝',
    romanization: 'kám-siā',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/kamsia.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h2-2',
    chinese: '多谢',
    romanization: 'to-siā',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/tosia.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h2-3',
    chinese: '免客氣',
    romanization: 'bián-kheh-khì',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/biankheh.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h2-4',
    chinese: 'sorry',
    romanization: 'sóh-lí',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/sohli.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h2-5',
    chinese: '原諒',
    romanization: 'goân-liōng',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/goanliong.mp3',
    status: 'coming_soon',
  },
  {
    phraseId: 'h2-6',
    chinese: '無要緊',
    romanization: 'bô-iàu-kín',
    speaker: 'Native Singapore Hokkien',
    region: 'Singapore',
    audioUrl: '/audio/hokkien/u1/boiaukun.mp3',
    status: 'coming_soon',
  },
];

// Get audio resource by phrase ID
export function getAudioResource(phraseId: string): AudioResource | undefined {
  return AUDIO_RESOURCES.find(r => r.phraseId === phraseId);
}

// Get all audio resources for a lesson
export function getLessonAudioResources(lessonId: string): AudioResource[] {
  // Extract unit from lesson ID (e.g., 'hokkien-u1-l1' -> unit 1)
  const match = lessonId.match(/u(\d+)/);
  if (!match) return [];
  
  const unit = parseInt(match[1], 10);
  const unitPrefix = `h${unit}`;
  
  // Get phrases for this unit (phrase IDs start with unit number)
  return AUDIO_RESOURCES.filter(r => r.phraseId.startsWith(unitPrefix));
}

// Get all audio resources for a unit
export function getUnitAudioResources(unit: number): AudioResource[] {
  const unitPrefix = `h${unit}`;
  return AUDIO_RESOURCES.filter(r => r.phraseId.startsWith(unitPrefix));
}

// Get count of available recordings
export function getAvailableCount(): number {
  return AUDIO_RESOURCES.filter(r => r.status === 'available').length;
}

export function getComingSoonCount(): number {
  return AUDIO_RESOURCES.filter(r => r.status === 'coming_soon').length;
}

export function getTotalCount(): number {
  return AUDIO_RESOURCES.length;
}

// Audio playback helper
export function playAudioResource(resource: AudioResource): void {
  if (resource.status !== 'available') {
    console.warn('Audio not yet available:', resource.phraseId);
    return;
  }
  
  const audio = new Audio(resource.audioUrl);
  audio.play().catch(err => {
    console.error('Failed to play audio:', err);
  });
}
