'use client';

import { useState, useEffect } from 'react';
import { ToneLadder } from './ToneLadder';
import { Button } from './Button';
import { Card } from './Card';
import { browserTTS } from '@/lib/tts';

interface ToneDrillProps {
  onComplete?: (correct: number, total: number) => void;
  dialect?: string;
}

const ALL_TONES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

interface DrillQuestion {
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  phrase: string;
  meaning: string;
}

// Sample phrases for each tone (Hokkien)
const tonePhrases: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, { phrase: string; meaning: string }[]> = {
  1: [
    { phrase: '哥', meaning: 'older brother' },
    { phrase: '山', meaning: 'mountain' },
    { phrase: '天', meaning: 'day/sky' },
  ],
  2: [
    { phrase: '鱼', meaning: 'fish' },
    { phrase: '茶', meaning: 'tea' },
    { phrase: '和时间', meaning: 'time' },
  ],
  3: [
    { phrase: '狗', meaning: 'dog' },
    { phrase: '雨', meaning: 'rain' },
    { phrase: '有', meaning: 'have' },
  ],
  4: [
    { phrase: '面', meaning: 'noodles' },
    { phrase: '兔', meaning: 'rabbit' },
    { phrase: '食', meaning: 'eat' },
  ],
  5: [
    { phrase: '星', meaning: 'star' },
    { phrase: '生', meaning: 'raw/life' },
    { phrase: '三', meaning: 'three' },
  ],
  6: [
    { phrase: '地', meaning: 'ground' },
    { phrase: '坐', meaning: 'sit' },
    { phrase: '下', meaning: 'down' },
  ],
  7: [
    { phrase: '七', meaning: 'seven' },
    { phrase: '西北', meaning: 'northwest' },
    { phrase: '雪', meaning: 'snow' },
  ],
  8: [
    { phrase: '月', meaning: 'moon/month' },
    { phrase: '袜', meaning: 'socks' },
    { phrase: '狭', meaning: 'narrow' },
  ],
};

export function ToneDrill({ onComplete, dialect = 'hokkien' }: ToneDrillProps) {
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState<DrillQuestion | null>(null);
  const [selectedTone, setSelectedTone] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionCount] = useState(10); // 10 questions per drill

  // Start a new drill
  const startDrill = () => {
    setIsActive(true);
    setCorrectCount(0);
    setTotalCount(0);
    nextQuestion();
  };

  // Generate next question
  const nextQuestion = () => {
    // Pick random tone
    const randomTone = ALL_TONES[Math.floor(Math.random() * ALL_TONES.length)];
    // Pick random phrase for that tone
    const phrases = tonePhrases[randomTone];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setQuestion({
      tone: randomTone,
      phrase: randomPhrase.phrase,
      meaning: randomPhrase.meaning,
    });
    setSelectedTone(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  // Handle tone selection
  const handleToneSelect = async (tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
    if (showFeedback || !question) return;
    
    setSelectedTone(tone);
    const correct = tone === question.tone;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    setTotalCount(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Auto-advance after feedback
    setTimeout(() => {
      if (totalCount + 1 >= questionCount) {
        // Drill complete
        setIsActive(false);
        onComplete?.(correctCount + (correct ? 1 : 0), questionCount);
      } else {
        nextQuestion();
      }
    }, 1500);
  };

  // Play the phrase audio
  const playPhrase = () => {
    if (!question) return;
    browserTTS(question.phrase);
  };

  if (!isActive) {
    // Start screen
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-xl font-bold mb-2">Quick Tone Drill</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Practice identifying tones with {questionCount} quick questions!
        </p>
        {totalCount > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-brand-brown">
              {Math.round((correctCount / questionCount) * 100)}%
            </div>
            <div className="text-sm text-gray-500">
              {correctCount}/{questionCount} correct
            </div>
          </div>
        )}
        <Button onClick={startDrill} className="w-full">
          Start Drill 🚀
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Question {totalCount + 1}/{questionCount}</span>
        <span>Score: {correctCount}/{totalCount}</span>
      </div>
      
      {/* Question Card */}
      <Card className="p-6 text-center">
        {/* Tone visualization */}
        <div className="mb-4">
          <ToneLadder 
            tone={question!.tone} 
            size="lg" 
            showLabel={false}
          />
        </div>
        
        {/* Phrase */}
        <div className="mb-2">
          <button 
            onClick={playPhrase}
            className="text-3xl font-bold hover:text-brand-brown transition-colors"
          >
            {question!.phrase} 🔊
          </button>
        </div>
        
        {/* Meaning hint */}
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          ({question!.meaning})
        </div>
        
        {/* Tone selector */}
        <div className="grid grid-cols-4 gap-2">
          {ALL_TONES.map((tone) => {
            const isSelected = selectedTone === tone;
            const isAnswer = question!.tone === tone;
            const showResult = showFeedback;
            
            let buttonClass = 'border-2 transition-all duration-200 ';
            if (showResult) {
              if (isAnswer) {
                buttonClass += 'bg-green-500 border-green-500 text-white';
              } else if (isSelected && !isAnswer) {
                buttonClass += 'bg-red-500 border-red-500 text-white';
              } else {
                buttonClass += 'border-gray-200 dark:border-gray-700 opacity-50';
              }
            } else {
              buttonClass += isSelected 
                ? 'border-brand-brown bg-brand-brown/10 text-brand-brown' 
                : 'border-gray-200 dark:border-gray-700 hover:border-brand-brown hover:bg-brand-brown/5';
            }
            
            return (
              <button
                key={tone}
                onClick={() => handleToneSelect(tone)}
                disabled={showFeedback}
                className={buttonClass + ' py-3 rounded-lg font-bold text-lg'}
              >
                {tone}
              </button>
            );
          })}
        </div>
        
        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
            {isCorrect ? '✅ Correct!' : `❌ That was Tone ${question!.tone}`}
          </div>
        )}
      </Card>
    </div>
  );
}

// Quick version - just 3 questions for home screen
export function QuickToneDrill({ onComplete }: { onComplete?: (correct: number, total: number) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState<DrillQuestion | null>(null);
  const [selectedTone, setSelectedTone] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [drillComplete, setDrillComplete] = useState(false);

  const nextQuestion = () => {
    const randomTone = ALL_TONES[Math.floor(Math.random() * ALL_TONES.length)];
    const phrases = tonePhrases[randomTone];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setQuestion({
      tone: randomTone,
      phrase: randomPhrase.phrase,
      meaning: randomPhrase.meaning,
    });
    setSelectedTone(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const startDrill = () => {
    setIsActive(true);
    setCorrectCount(0);
    setTotalCount(0);
    setDrillComplete(false);
    nextQuestion();
  };

  const handleToneSelect = async (tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
    if (showFeedback || !question) return;
    
    setSelectedTone(tone);
    const correct = tone === question.tone;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    const newTotal = totalCount + 1;
    const newCorrect = correctCount + (correct ? 1 : 0);
    setTotalCount(newTotal);
    setCorrectCount(newCorrect);
    
    setTimeout(() => {
      if (newTotal >= 3) {
        setDrillComplete(true);
        onComplete?.(newCorrect, 3);
      } else {
        nextQuestion();
      }
    }, 1200);
  };

  const playPhrase = () => {
    if (!question) return;
    browserTTS(question.phrase);
  };

  if (!isActive) {
    return (
      <Button onClick={startDrill} className="w-full">
        🎯 Quick Tone Drill
      </Button>
    );
  }

  if (drillComplete) {
    return (
      <Card className="p-4 text-center">
        <div className="text-2xl mb-2">
          {correctCount === 3 ? '🎉' : correctCount >= 2 ? '👏' : '💪'}
        </div>
        <div className="text-xl font-bold mb-1">
          {correctCount}/3 Correct!
        </div>
        <Button onClick={startDrill} className="mt-2 text-sm py-2">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="text-center mb-3">
        <button onClick={playPhrase} className="text-2xl font-bold hover:text-brand-brown">
          {question?.phrase} 🔊
        </button>
        <div className="text-sm text-gray-500">({question?.meaning})</div>
      </div>
      
      <div className="grid grid-cols-4 gap-1 mb-3">
        {ALL_TONES.map((tone) => {
          const isSelected = selectedTone === tone;
          const isAnswer = question?.tone === tone;
          
          let btnClass = 'py-2 rounded font-bold text-sm transition-all ';
          if (showFeedback) {
            if (isAnswer) btnClass += 'bg-green-500 text-white';
            else if (isSelected) btnClass += 'bg-red-500 text-white';
            else btnClass += 'bg-gray-100 dark:bg-gray-800 opacity-50';
          } else {
            btnClass += isSelected 
              ? 'bg-brand-brown text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-brand-brown/20';
          }
          
          return (
            <button
              key={tone}
              onClick={() => handleToneSelect(tone)}
              disabled={showFeedback}
              className={btnClass}
            >
              {tone}
            </button>
          );
        })}
      </div>
      
      {showFeedback && (
        <div className={`text-center text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? '✅' : `❌ Tone ${question?.tone}`}
        </div>
      )}
    </Card>
  );
}
