// Family Recordings - User-uploaded pronunciation recordings
// Allows family members to contribute their own recordings for practice

export interface FamilyRecording {
  id: string;
  phraseId: string;
  chinese: string;
  romanization: string;
  audioBlob: string; // Base64 encoded audio
  recordedBy: string; // Name of family member
  createdAt: string;
}

const STORAGE_KEY = 'lahlingo_family_recordings';

// Get all family recordings from localStorage
export function getFamilyRecordings(): FamilyRecording[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get recordings for a specific phrase
export function getFamilyRecording(phraseId: string): FamilyRecording | undefined {
  const recordings = getFamilyRecordings();
  return recordings.find(r => r.phraseId === phraseId);
}

// Get all recordings for a lesson (by unit)
export function getLessonFamilyRecordings(lessonId: string): FamilyRecording[] {
  const recordings = getFamilyRecordings();
  const match = lessonId.match(/u(\d+)/);
  if (!match) return [];
  
  const unit = parseInt(match[1], 10);
  const unitPrefix = `h${unit}`;
  
  return recordings.filter(r => r.phraseId.startsWith(unitPrefix));
}

// Save a new family recording
export function saveFamilyRecording(recording: Omit<FamilyRecording, 'id' | 'createdAt'>): FamilyRecording {
  const recordings = getFamilyRecordings();
  
  // Check if recording already exists for this phrase, replace it
  const existingIndex = recordings.findIndex(r => r.phraseId === recording.phraseId);
  
  const newRecording: FamilyRecording = {
    ...recording,
    id: `fam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  if (existingIndex >= 0) {
    recordings[existingIndex] = newRecording;
  } else {
    recordings.push(newRecording);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
  return newRecording;
}

// Delete a family recording
export function deleteFamilyRecording(recordingId: string): boolean {
  const recordings = getFamilyRecordings();
  const filtered = recordings.filter(r => r.id !== recordingId);
  
  if (filtered.length === recordings.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Get recording count
export function getFamilyRecordingCount(): number {
  return getFamilyRecordings().length;
}

// Clear all family recordings
export function clearAllFamilyRecordings(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Play a family recording
export function playFamilyRecording(recording: FamilyRecording): void {
  if (!recording.audioBlob) {
    console.warn('No audio data for recording:', recording.id);
    return;
  }
  
  const audio = new Audio(recording.audioBlob);
  audio.play().catch(err => {
    console.error('Failed to play family recording:', err);
  });
}
