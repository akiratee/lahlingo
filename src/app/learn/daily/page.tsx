'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { 
  getDailyChallenge, 
  hasCompletedTodayChallenge, 
  markChallengeCompleted,
  getTimeUntilNextChallenge,
  DailyChallenge 
} from '../lib/daily-challenge';
import { Dialect, QuizQuestion } from '../types';

export default function DailyChallengePage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if already completed today
    if (hasCompletedTodayChallenge()) {
      setIsCompleted(true);
      setTimeUntilNext(getTimeUntilNextChallenge());
    } else {
      setChallenge(getDailyChallenge());
    }
  }, []);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !challenge) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setShowResult(true);
    
    // Check if correct
    const isCorrect = selectedAnswer === challenge.questions[currentQuestion].correctIndex;
    
    // Move to next or finish
    setTimeout(() => {
      if (currentQuestion + 1 >= challenge.questions.length) {
        // Calculate final score
        const finalAnswers = [...newAnswers];
        const correctCount = finalAnswers.filter((a, i) => 
          a === challenge.questions[i].correctIndex
        ).length;
        const finalScore = Math.round((correctCount / challenge.questions.length) * 100);
        setScore(finalScore);
        
        // Mark as completed
        const result = markChallengeCompleted(finalScore);
        setXpEarned(result.xpEarned);
        setCompleted(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1200);
  };

  const getDialectColor = (dialect: Dialect): string => {
    const colors: Record<Dialect, string> = {
      hokkien: 'bg-orange-500',
      teochew: 'bg-blue-500',
      cantonese: 'bg-green-500',
      hakka: 'bg-purple-500',
    };
    return colors[dialect];
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-2">Challenge Complete!</h1>
            <p className="text-slate-400 mb-6">
              You&apos;ve already conquered today&apos;s challenge.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Next challenge in {timeUntilNext.hours}h {timeUntilNext.minutes}m
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return <Loading />;
  }

  if (completed) {
    const correctCount = answers.filter((a, i) => 
      a === challenge.questions[i].correctIndex
    ).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-white mb-2">Great Job!</h1>
            <p className="text-slate-400 mb-4">
              You completed today&apos;s challenge!
            </p>
            
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="text-4xl font-bold text-white mb-2">{score}%</div>
              <div className="text-slate-400">
                {correctCount} of {challenge.questions.length} correct
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 mb-6">
              <div className="text-lg font-bold text-white">+{xpEarned} XP</div>
              <div className="text-yellow-100 text-sm">Including {challenge.xpBonus} bonus!</div>
            </div>
            
            <Button onClick={() => router.push('/')} className="w-full">
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const question = challenge.questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;
  const progress = ((currentQuestion + 1) / challenge.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="text-slate-400"
          >
            ← Back
          </Button>
          <div className="text-slate-400 text-sm">
            {currentQuestion + 1} / {challenge.questions.length}
          </div>
        </div>
        
        {/* Challenge Info */}
        <div className={`${getDialectColor(challenge.dialect)} rounded-lg p-3 mb-6 text-center`}>
          <div className="text-white font-semibold">{challenge.dialect.toUpperCase()}</div>
          <div className="text-white/80 text-sm">{challenge.title}</div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Question */}
        <Card className="p-6 mb-6">
          <div className="text-slate-400 text-sm mb-2">
            {question.type === 'listening' ? '👂 Listening' : '📖 Vocabulary'}
          </div>
          <h2 className="text-xl font-semibold text-white mb-6">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = 'w-full p-4 rounded-lg text-left transition-all ';
              
              if (showResult) {
                if (index === question.correctIndex) {
                  buttonClass += 'bg-green-500/20 border-2 border-green-500 text-green-400';
                } else if (index === selectedAnswer) {
                  buttonClass += 'bg-red-500/20 border-2 border-red-500 text-red-400';
                } else {
                  buttonClass += 'bg-slate-800 text-slate-500';
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += 'bg-blue-500/20 border-2 border-blue-500 text-white';
                } else {
                  buttonClass += 'bg-slate-800 border-2 border-transparent text-slate-300 hover:border-slate-600';
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </Card>
        
        {/* Submit Button */}
        {!showResult && (
          <Button 
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}
        
        {/* Feedback */}
        {showResult && (
          <div className="text-center">
            <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
          </div>
        )}
        
        {/* XP Bonus Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
            +{challenge.xpBonus} Bonus XP Available!
          </div>
        </div>
      </div>
    </div>
  );
}
