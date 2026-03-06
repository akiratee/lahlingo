'use client';

import { useState, useEffect } from 'react';
import { QuizQuestion } from '@/types';
import { 
  generateQuickReviewQuestions, 
  checkQuickReviewAnswer, 
  calculateQuickReviewXP,
  getQuickReviewVocabularyCount
} from '@/lib/quick-review';
import { addXP } from '@/lib/progress';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface QuickReviewProps {
  onComplete?: (xpEarned: number) => void;
  onExit?: () => void;
}

export function QuickReview({ onComplete, onExit }: QuickReviewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [vocabCount, setVocabCount] = useState(0);

  useEffect(() => {
    setVocabCount(getQuickReviewVocabularyCount());
  }, []);

  const startReview = () => {
    const reviewQuestions = generateQuickReviewQuestions(5);
    if (reviewQuestions && reviewQuestions.length > 0) {
      setQuestions(reviewQuestions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setCorrectCount(0);
      setQuizComplete(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = checkQuickReviewAnswer(questions[currentIndex], answerIndex);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      const xpEarned = calculateQuickReviewXP(correctCount, questions.length);
      addXP(xpEarned);
      setQuizComplete(true);
      if (onComplete) {
        onComplete(xpEarned);
      }
    }
  };

  // Start review automatically on mount if not started
  useEffect(() => {
    if (questions.length === 0 && vocabCount > 0) {
      startReview();
    }
  }, [vocabCount]);

  // No vocabulary available
  if (vocabCount === 0) {
    return (
      <div className="min-h-screen bg-amber-50 p-4">
        <Card className="max-w-md mx-auto mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">📚 Quick Review</h2>
            <p className="text-gray-600 mb-4">
              Complete some lessons first to unlock quick review practice!
            </p>
            <Button onClick={onExit}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz complete screen
  if (quizComplete) {
    const xpEarned = calculateQuickReviewXP(correctCount, questions.length);
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-amber-50 p-4">
        <Card className="max-w-md mx-auto mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">🎉 Great Job!</h2>
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🌟' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <p className="text-xl text-gray-700 mb-2">
              You got {correctCount} out of {questions.length} correct!
            </p>
            <p className="text-lg text-amber-600 font-bold mb-4">
              +{xpEarned} XP earned!
            </p>
            <div className="space-y-2">
              <Button onClick={startReview} className="w-full">
                Try Again
              </Button>
              <Button onClick={onExit} variant="secondary" className="w-full">
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 p-4">
        <Card className="max-w-md mx-auto mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">📚 Quick Review</h2>
            <p className="text-gray-600 mb-4">Loading your review...</p>
            <Button onClick={startReview}>
              Start Review
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-md mx-auto mt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-amber-800">Quick Review</h1>
          <button onClick={onExit} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-200 rounded-full h-2 mb-4">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Question {currentIndex + 1} of {questions.length} • {correctCount} correct
        </p>

        {/* Question */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all
                    ${!showResult 
                      ? isSelected 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-white border-2 border-amber-200 hover:border-amber-400'
                      : showCorrect
                        ? 'bg-green-500 text-white'
                        : showWrong
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  <span className="font-medium">{option}</span>
                  {showCorrect && <span className="float-right">✓</span>}
                  {showWrong && <span className="float-right">✗</span>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Next button */}
        {showResult && (
          <Button onClick={handleNext} className="w-full">
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
