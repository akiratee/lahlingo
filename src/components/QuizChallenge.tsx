'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuizQuestion } from '@/types';
import { 
  generateQuizChallenge, 
  checkQuizAnswer, 
  calculateQuizXP,
  saveQuizResult,
  getAvailableQuizCount,
  getQuizStats
} from '@/lib/quiz-challenge';
import { addXP } from '@/lib/progress';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Loading';

interface QuizChallengeProps {
  onComplete?: (xpEarned: number) => void;
}

export function QuizChallenge({ onComplete }: QuizChallengeProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);

  useEffect(() => {
    setAvailableCount(getAvailableQuizCount());
    setAnswers(new Array(10).fill(null));
  }, []);

  const startQuiz = () => {
    const quizQuestions = generateQuizChallenge(10);
    if (quizQuestions && quizQuestions.length > 0) {
      setQuestions(quizQuestions);
      setAnswers(new Array(quizQuestions.length).fill(null));
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuizComplete(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      const correctCount = answers.reduce<number>((count, answer, idx) => {
        return (answer !== null && answer === questions[idx].correctIndex) ? count + 1 : count;
      }, 0);
      
      const xpEarned = calculateQuizXP(correctCount, questions.length);
      addXP(xpEarned);
      
      saveQuizResult({
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        xpEarned,
        lessonIds: questions.map(q => q.lessonId || '').filter(Boolean),
      });
      
      setQuizComplete(true);
      onComplete?.(xpEarned);
    }
  };

  const stats = getQuizStats();

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">🎯 Quick Quiz</h1>
          
          {availableCount > 0 ? (
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-xl font-semibold mb-2">Ready to Test Your Knowledge?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have {availableCount} quiz questions from your completed lessons.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Answer {Math.min(10, availableCount)} questions and earn XP!
              </p>
              <Button onClick={startQuiz} className="w-full">
                Start Quiz
              </Button>
            </Card>
          ) : (
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-xl font-semibold mb-2">No Quizzes Available</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete some lessons first to unlock quiz questions!
              </p>
              <Link href="/learn">
                <Button className="w-full">
                  Start Learning
                </Button>
              </Link>
            </Card>
          )}
          
          {stats.totalQuizzes > 0 && (
            <Card className="mt-6 p-4">
              <h3 className="font-semibold mb-3">Your Quiz Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                  <div className="text-gray-500">Quizzes Taken</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
                  <div className="text-gray-500">Avg Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.bestStreak}</div>
                  <div className="text-gray-500">Best Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.xpEarned}</div>
                  <div className="text-gray-500">XP Earned</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const correctCount: number = answers.reduce<number>((count, answer, idx) => {
      return answer === questions[idx].correctIndex ? count + 1 : count;
    }, 0);
    const xpEarned = calculateQuizXP(correctCount, questions.length);
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center p-6">
            <div className="text-5xl mb-4">
              {accuracy === 100 ? '🏆' : accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You got {correctCount} out of {questions.length} correct ({accuracy}%)
            </p>
            
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">+{xpEarned} XP</div>
              <div className="text-sm text-green-600 dark:text-green-400">earned</div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={startQuiz} className="w-full">
                Try Again
              </Button>
              <Link href="/" className="block">
                <Button variant="secondary" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctIndex;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentIndex) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-orange transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="p-6 mb-6">
          <div className="text-sm text-gray-500 mb-2">
            {currentQuestion.lessonTitle || 'Quiz Question'}
          </div>
          <h2 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all ';
              
              if (showResult) {
                if (idx === currentQuestion.correctIndex) {
                  buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900';
                } else if (idx === selectedAnswer) {
                  buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900';
                } else {
                  buttonClass += 'border-gray-200 dark:border-gray-700';
                }
              } else {
                buttonClass += idx === selectedAnswer 
                  ? 'border-brand-orange bg-orange-50 dark:bg-orange-900' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-orange';
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span className="font-medium">{option}</span>
                </button>
              );
            })}
          </div>
          
          {showResult && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              isCorrect 
                ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300'
            }`}>
              {isCorrect ? '✅ Correct!' : `❌ Wrong! The answer is: ${currentQuestion.options[currentQuestion.correctIndex]}`}
            </div>
          )}
        </Card>
        
        {/* Actions */}
        {!showResult ? (
          <Button 
            onClick={handleNext} 
            disabled={selectedAnswer === null}
            className="w-full"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleContinue} className="w-full">
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuizChallenge;
