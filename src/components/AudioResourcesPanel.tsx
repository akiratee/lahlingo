'use client';

import { useState, useEffect } from 'react';
import { AudioResource, getLessonAudioResources, playAudioResource } from '@/lib/audio-resources';
import { getLessonFamilyRecordings, FamilyRecording, playFamilyRecording } from '@/lib/family-recordings';
import { Card } from '@/components/Card';
import { Button, PlayButton } from '@/components/Button';
import { FamilyRecordingUpload } from './FamilyRecordingUpload';

interface AudioResourcesPanelProps {
  lessonId: string;
}

export function AudioResourcesPanel({ lessonId }: AudioResourcesPanelProps) {
  const [resources, setResources] = useState<AudioResource[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [familyRecordings, setFamilyRecordings] = useState<FamilyRecording[]>([]);

  useEffect(() => {
    const lessonResources = getLessonAudioResources(lessonId);
    setResources(lessonResources);
    const family = getLessonFamilyRecordings(lessonId);
    setFamilyRecordings(family);
  }, [lessonId]);

  const handlePlay = (resource: AudioResource) => {
    if (resource.status !== 'available') return;
    
    if (playingId === resource.phraseId) {
      setPlayingId(null);
      return;
    }
    
    setPlayingId(resource.phraseId);
    playAudioResource(resource);
    
    setTimeout(() => {
      setPlayingId(null);
    }, 2000);
  };

  const handlePlayFamilyRecording = (recording: FamilyRecording) => {
    if (playingId === recording.id) {
      setPlayingId(null);
      return;
    }
    setPlayingId(recording.id);
    playFamilyRecording(recording);
    setTimeout(() => setPlayingId(null), 2000);
  };

  const handleRecordingComplete = () => {
    const family = getLessonFamilyRecordings(lessonId);
    setFamilyRecordings(family);
    setShowUpload(false);
  };

  if (resources.length === 0) {
    return null;
  }

  const availableCount = resources.filter(r => r.status === 'available').length;
  const comingSoonCount = resources.filter(r => r.status === 'coming_soon').length;

  return (
    <Card className="mb-6 bg-brand-brown/5 border-brand-brown/20">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-brand-brown">🔊 Audio Resources</h3>
          <span className="text-xs px-2 py-1 rounded bg-brand-brown/10 text-brand-brown">
            Dev Mode
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {availableCount} available • {comingSoonCount} coming soon
          </span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {resources.map((resource) => (
            <div 
              key={resource.phraseId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                resource.status === 'available' 
                  ? 'bg-white dark:bg-gray-800' 
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{resource.chinese}</span>
                  <span className="text-sm text-gray-500">({resource.romanization})</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {resource.status === 'available' ? (
                    <>🎤 {resource.speaker} • 📍 {resource.region}</>
                  ) : (
                    <>⏳ Recording coming soon</>
                  )}
                </div>
              </div>
              
              {resource.status === 'available' ? (
                <PlayButton
                  onClick={() => handlePlay(resource)}
                  size="sm"
                  isPlaying={playingId === resource.phraseId}
                />
              ) : (
                <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-500">
                  Soon
                </span>
              )}
            </div>
          ))}
          
          <div className="pt-2 border-t border-brand-brown/10">
            <p className="text-xs text-gray-500 mb-2">
              💡 These are authentic Singapore Hokkien recordings. Help improve the app by 
              contributing your own recordings!
            </p>
            
            {familyRecordings.length > 0 && (
              <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  👨‍👩‍👧‍👦 Family Recordings ({familyRecordings.length})
                </p>
                {familyRecordings.map((recording) => (
                  <div 
                    key={recording.id}
                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded mb-1"
                  >
                    <div>
                      <span className="font-medium text-sm">{recording.chinese}</span>
                      <span className="text-xs text-gray-500 ml-1">({recording.romanization})</span>
                      <div className="text-xs text-gray-400">
                        Recorded by {recording.recordedBy}
                      </div>
                    </div>
                    <PlayButton
                      onClick={() => handlePlayFamilyRecording(recording)}
                      size="sm"
                      isPlaying={playingId === recording.id}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {!showUpload ? (
              <button
                onClick={() => setShowUpload(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                🎙️ Record your family's voice
              </button>
            ) : (
              <FamilyRecordingUpload
                phraseId={resources[0]?.phraseId || ''}
                chinese={resources[0]?.chinese || ''}
                romanization={resources[0]?.romanization || ''}
                onRecordingComplete={handleRecordingComplete}
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export function AudioResourceRow({ 
  resource, 
  onPlay 
}: { 
  resource: AudioResource; 
  onPlay?: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (resource.status !== 'available') return;
    setIsPlaying(true);
    onPlay?.();
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{resource.chinese}</span>
          <span className="text-sm text-gray-500">({resource.romanization})</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {resource.status === 'available' ? (
            <>🎤 {resource.speaker} • 📍 {resource.region}</>
          ) : (
            <>⏳ Recording coming soon</>
          )}
        </div>
      </div>
      
      {resource.status === 'available' ? (
        <PlayButton
          onClick={handlePlay}
          size="sm"
          isPlaying={isPlaying}
        />
      ) : (
        <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-500">
          Soon
        </span>
      )}
    </div>
  );
}

export default AudioResourcesPanel;
