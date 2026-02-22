'use client';

import { useState, useEffect } from 'react';
import { MANDARIN_TEST_PHRASES, calculateChineseMatch } from '@/lib/mandarin-poc';

export default function MandarinPOCTes() {
  const [currentPhrase, setCurrentPhrase] = useState(MANDARIN_TEST_PHRASES[0]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Array<{spoken: string; target: string; percentage: number}>>([]);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'zh-CN'; // Mandarin
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        const match = calculateChineseMatch(spoken, currentPhrase.chinese);
        setMatchResult(match);
        setTestResults(prev => [...prev, { spoken, target: currentPhrase.chinese, percentage: match }]);
        setIsListening(false);
      };
      
      rec.onerror = (event: any) => {
        setError(`Recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(rec);
    }
  }, [currentPhrase]);

  const startListening = () => {
    setError(null);
    setTranscript(null);
    setMatchResult(null);
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        setError('Already started');
      }
    } else {
      setError('Speech recognition not supported');
    }
  };

  const nextPhrase = () => {
    const currentIndex = MANDARIN_TEST_PHRASES.indexOf(currentPhrase);
    const nextIndex = (currentIndex + 1) % MANDARIN_TEST_PHRASES.length;
    setCurrentPhrase(MANDARIN_TEST_PHRASES[nextIndex]);
    setTranscript(null);
    setMatchResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">🎤 Mandarin Voice Matching POC</h1>
        <p className="text-gray-600 mb-6">Test that browser speech recognition + Levenshtein matching works</p>
        
        {/* Current Phrase */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentPhrase.chinese}</div>
            <div className="text-xl text-gray-600 mb-1">{currentPhrase.pinyin}</div>
            <div className="text-gray-500">{currentPhrase.english}</div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Speak Mandarin'}
            </button>
            
            <button
              onClick={nextPhrase}
              className="px-6 py-3 rounded-full font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Next Phrase →
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
        
        {/* Results */}
        {transcript && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Result</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">You said:</span>
                <span className="font-medium">{transcript}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium">{currentPhrase.chinese}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Match:</span>
                <span className={`text-2xl font-bold ${
                  matchResult && matchResult >= 80 ? 'text-green-500' :
                  matchResult && matchResult >= 60 ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {matchResult}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Test History */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Test History</h2>
            <div className="space-y-2">
              {testResults.slice(-5).reverse().map((result, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    &ldquo;{result.spoken}&rdquo; → &ldquo;{result.target}&rdquo;
                  </span>
                  <span className={`font-semibold ${
                    result.percentage >= 80 ? 'text-green-500' :
                    result.percentage >= 60 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {result.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <strong>How this works:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Browser speech recognition listens for Mandarin (zh-CN)</li>
            <li>Returns Chinese characters as transcript</li>
            <li>Levenshtein distance compares spoken → target characters</li>
            <li>Shows match percentage (0-100%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
