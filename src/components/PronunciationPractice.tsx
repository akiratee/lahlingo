'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  isSpeechRecognitionSupported, 
  createSpeechRecognitionSession,
  scorePronunciation,
  type SpeechRecognitionResult,
  type PronunciationScore
} from '../lib/speech-recognition';

interface PronunciationPracticeProps {
  phrase: string;
  translation: string;
  dialect: string;
  onComplete?: (score: PronunciationScore) => void;
}

export function PronunciationPractice({ 
  phrase, 
  translation, 
  dialect,
  onComplete 
}: PronunciationPracticeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentResult, setCurrentResult] = useState<PronunciationScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; abort: () => void } | null>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    setError(null);
    setTranscript('');
    setCurrentResult(null);
    setIsListening(true);

    recognitionRef.current = createSpeechRecognitionSession(
      // onResult
      (result: SpeechRecognitionResult) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          const score = scorePronunciation(result.transcript, phrase);
          setCurrentResult(score);
          setIsListening(false);
          onComplete?.(score);
        }
      },
      // onError
      (errorMsg: string) => {
        setError(errorMsg);
        setIsListening(false);
      },
      // onEnd
      () => {
        setIsListening(false);
      }
    );

    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const tryAgain = () => {
    setTranscript('');
    setCurrentResult(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pronunciation Practice</h3>
      
      {/* Target phrase */}
      <div className="mb-6">
        <p className="text-2xl font-bold text-center text-indigo-700 mb-2">{phrase}</p>
        <p className="text-center text-gray-600">{translation}</p>
        <p className="text-xs text-center text-gray-400 mt-1">Dialects: {dialect}</p>
      </div>

      {/* Status indicators */}
      {isListening && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-red-600 font-medium">Listening...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Transcript */}
      {transcript && !currentResult && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">You said:</span> {transcript}
          </p>
        </div>
      )}

      {/* Results */}
      {currentResult && (
        <div className={`rounded-lg p-4 mb-4 ${
          currentResult.isMatch ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="text-center mb-2">
            <span className="text-3xl">{currentResult.isMatch ? '⭐' : '💪'}</span>
          </div>
          <p className={`text-center font-semibold ${
            currentResult.isMatch ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {currentResult.feedback}
          </p>
          <div className="mt-3 text-center">
            <span className="text-gray-600">Match: </span>
            <span className="font-bold text-gray-800">{currentResult.similarity}%</span>
          </div>
          <div className="mt-2 text-center text-sm text-gray-500">
            <p>Target: "{currentResult.targetPhrase}"</p>
            <p>You said: "{currentResult.transcript}"</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!currentResult ? (
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400'
            }`}
          >
            {isListening ? 'Stop' : isSupported ? '🎤 Start Speaking' : 'Not Supported'}
          </button>
        ) : (
          <button
            onClick={tryAgain}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-semibold transition-all"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Help text */}
      {!isSupported && (
        <p className="text-xs text-gray-500 text-center mt-4">
          Speech recognition works best in Chrome, Edge, or Safari.
        </p>
      )}
    </div>
  );
}

export default PronunciationPractice;
