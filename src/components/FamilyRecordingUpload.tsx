'use client';

import { useState, useRef, useEffect } from 'react';
import { FamilyRecording, saveFamilyRecording, getFamilyRecording } from '@/lib/family-recordings';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface FamilyRecordingUploadProps {
  phraseId: string;
  chinese: string;
  romanization: string;
  onRecordingComplete?: (recording: FamilyRecording) => void;
}

export function FamilyRecordingUpload({ 
  phraseId, 
  chinese, 
  romanization,
  onRecordingComplete 
}: FamilyRecordingUploadProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedName, setRecordedName] = useState('');
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Check if there's an existing recording
  useEffect(() => {
    const existing = getFamilyRecording(phraseId);
    setHasRecording(!!existing);
  }, [phraseId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          
          if (recordedName.trim()) {
            const recording = saveFamilyRecording({
              phraseId,
              chinese,
              romanization,
              audioBlob: base64,
              recordedBy: recordedName.trim(),
            });
            setHasRecording(true);
            onRecordingComplete?.(recording);
          }
        };
        reader.readAsDataURL(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Could not access microphone. Please grant permission.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const playRecording = () => {
    const existing = getFamilyRecording(phraseId);
    if (existing?.audioBlob) {
      const audio = new Audio(existing.audioBlob);
      audio.play();
    }
  };

  return (
    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-200 mb-3">
        🎙️ Record Your Family's Voice
      </h4>
      
      {!hasRecording ? (
        <>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Record your own pronunciation to personalize your learning!
          </p>
          
          <input
            type="text"
            placeholder="Your name (e.g., Grandma, Dad)"
            value={recordedName}
            onChange={(e) => setRecordedName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg mb-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          
          <div className="flex gap-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={!recordedName.trim()}
                variant="primary"
              >
                🎤 Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="secondary"
                className="!bg-red-500 !text-white hover:!bg-red-600"
              >
                ⏹️ Stop Recording
              </Button>
            )}
          </div>
          
          {isRecording && (
            <p className="text-xs text-red-600 mt-2 animate-pulse">
              🔴 Recording... Speak now!
            </p>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✅ Recording saved!
            </p>
            <button 
              onClick={playRecording}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              🔊 Play your recording
            </button>
          </div>
          <Button
            onClick={() => {
              setHasRecording(false);
            }}
            variant="secondary"
          >
            Re-record
          </Button>
        </div>
      )}
    </div>
  );
}

export default FamilyRecordingUpload;
