'use client';

import { useState, useEffect } from 'react';
import { Lesson } from '@/types';
import { Card, PhraseCard } from '@/components/Card';
import { Button, PlayButton } from '@/components/Button';
import { ToneLadder } from '@/components/ToneLadder';
import { useSpeechRecognition, useAudio } from '@/hooks/useSpeechRecognition';
import { markLessonComplete, xpProgressInLevel, xpToNextLevel, getStoredProfile, getStoredProgress, getStoredAchievements, getWeeklyActivity, getTriedDialects, saveAchievements, incrementLessonsCompleted, addStudyMinutes, addToWeeklyActivity } from '@/lib/progress';
import { checkAndAwardAchievements } from '@/lib/achievements';
import { addLessonFlashcards } from '@/lib/flashcard-review';
import { getLessonById, getNextLesson } from '@/lib/lessons';
import { isDevMode } from '@/lib/config';
import { AudioResourcesPanel } from '@/components/AudioResourcesPanel';
import FavoritesButton from '@/components/FavoritesButton';

interface LessonPlayerProps {
  lessonId: string;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

type LessonSection = 'intro' | 'vocabulary' | 'dialogue' | 'quiz' | 'complete';

export function LessonPlayer({ lessonId, onComplete, onExit }: LessonPlayerProps) {
  const lesson = getLessonById(lessonId);
  
  const [section, setSection] = useState<LessonSection>('intro');
  const [vocabIndex, setVocabIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Lesson not found</h2>
          <Button onClick={onExit}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const currentVocab = lesson.vocabulary[vocabIndex];
  const progress = ((vocabIndex + 1) / lesson.vocabulary.length) * 100;
  const quizProgress = Object.keys(quizAnswers).length / lesson.quiz.length;

  const handleStart = () => setSection('vocabulary');
  
  const handleNextVocab = () => {
    if (vocabIndex < lesson.vocabulary.length - 1) {
      setVocabIndex(vocabIndex + 1);
    } else if (lesson.dialogue) {
      setSection('dialogue');
    } else if (lesson.quiz.length > 0) {
      setSection('quiz');
    } else {
      completeLesson();
    }
  };
  
  const handlePrevVocab = () => {
    if (vocabIndex > 0) {
      setVocabIndex(vocabIndex - 1);
    }
  };
  
  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
  };
  
  const handleCompleteQuiz = () => {
    // Calculate score
    let correct = 0;
    lesson.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const score = Math.round((correct / lesson.quiz.length) * 100);
    setTotalScore(score);
    setShowResults(true);
  };
  
  const completeLesson = () => {
    // Calculate XP (base + bonus for quiz score)
    let xpEarned = lesson.xpReward;
    if (lesson.quiz.length > 0 && totalScore > 0) {
      xpEarned += Math.round(totalScore / 10); // Bonus XP for quiz
    }
    
    // Complete the lesson (updates XP, level, streak)
    markLessonComplete(lessonId, xpEarned, lesson.dialect, totalScore);
    
    // Add flashcards for spaced repetition review
    addLessonFlashcards(lessonId);
    
    // Track daily goal progress (assume ~5 minutes per lesson)
    incrementLessonsCompleted();
    addStudyMinutes(5);
    addToWeeklyActivity(5); // Track weekly activity
    
    // Check and award any new achievements
    const profile = getStoredProfile();
    const storedProgress = getStoredProgress();
    if (profile) {
      // Build current progress state for achievement checking
      const currentState = {
        profile,
        completedLessons: storedProgress || {}, // Pass actual completed lessons
        achievements: getStoredAchievements() || {},
        weeklyActivity: getWeeklyActivity() || {},
        triedDialects: getTriedDialects(),
      };
      const { newAchievements, updatedState } = checkAndAwardAchievements(currentState);
      
      // Save any newly earned achievements
      if (newAchievements.length > 0) {
        saveAchievements(updatedState.achievements);
        
        // Show notification for new achievements
        if (typeof window !== 'undefined') {
          const achievementNames = newAchievements.map(a => `${a.icon} ${a.title}`).join(', ');
          // Brief visual feedback will be shown in the complete section
        }
      }
    }
    
    setSection('complete');
    onComplete(xpEarned);
  };

  // Intro screen
  if (section === 'intro') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <FavoritesButton lessonId={lessonId} size="sm" />
          </div>
          <p className="text-gray-500 mb-4">{lesson.subtitle}</p>
          
          <div className="text-sm text-gray-400 mb-8">{lesson.duration}</div>
          
          <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Skills you&apos;ll learn:</h3>
            <ul className="text-sm space-y-1">
              {lesson.vocabulary.slice(0, 3).map(v => (
                <li key={v.id}>• {v.phrase.english}</li>
              ))}
              {lesson.vocabulary.length > 3 && (
                <li className="text-gray-400">• And more...</li>
              )}
            </ul>
          </div>
          
          <Button onClick={handleStart} className="w-full h-14 text-lg">
            Start Lesson
          </Button>
          
          <button onClick={onExit} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
            ← Exit Lesson
          </button>
        </Card>
      </div>
    );
  }

  // Vocabulary section
  if (section === 'vocabulary') {
    return (
      <LessonVocabularySection
        lesson={lesson}
        lessonId={lessonId}
        vocabIndex={vocabIndex}
        progress={progress}
        onNext={handleNextVocab}
        onPrev={handlePrevVocab}
        onExit={onExit}
      />
    );
  }

  // Dialogue section
  if (section === 'dialogue' && lesson.dialogue) {
    return (
      <DialogueSection
        dialogue={lesson.dialogue}
        onComplete={() => {
          if (lesson.quiz.length > 0) {
            setSection('quiz');
          } else {
            completeLesson();
          }
        }}
        onBack={() => setSection('vocabulary')}
        onExit={onExit}
      />
    );
  }

  // Quiz section
  if (section === 'quiz') {
    return (
      <QuizSection
        questions={lesson.quiz}
        answers={quizAnswers}
        onAnswer={handleQuizAnswer}
        onComplete={handleCompleteQuiz}
        onBack={() => lesson.dialogue ? setSection('dialogue') : setSection('vocabulary')}
        onExit={onExit}
      />
    );
  }

  // Completion screen
  if (section === 'complete') {
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={lesson.xpReward}
        quizScore={lesson.quiz.length > 0 ? totalScore : undefined}
        onContinue={() => {
          const nextLesson = getNextLesson(lessonId);
          if (nextLesson) {
            // Navigate to next lesson
            window.location.href = `/learn/hokkien/${nextLesson.unit}/${nextLesson.lesson}`;
          } else {
            onExit();
          }
        }}
        onExit={onExit}
      />
    );
  }

  return null;
}

// Vocabulary Section Component
function LessonVocabularySection({
  lesson,
  lessonId,
  vocabIndex,
  progress,
  onNext,
  onPrev,
  onExit,
}: {
  lesson: Lesson;
  lessonId: string;
  vocabIndex: number;
  progress: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) {
  const currentPhrase = lesson.vocabulary[vocabIndex];
  const { isListening, result, start, supportCheck } = useSpeechRecognition(currentPhrase.phrase.romanization);
  const { isPlaying, isLoading, play, stop } = useAudio();
  const [devMode, setDevMode] = useState(false);

  // Check dev mode on mount
  useEffect(() => {
    setDevMode(isDevMode());
  }, []);
  
  const handlePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      play(currentPhrase.phrase.chinese);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <FavoritesButton lessonId={lessonId} size="sm" />
            <span className="text-sm text-gray-500">
              {vocabIndex + 1}/{lesson.vocabulary.length}
            </span>
          </div>
        </div>
        
        {/* Progress */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div 
            className="bg-brand-brown h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Phrase Card */}
        <div className="mb-6">
          <PhraseCard
            chinese={currentPhrase.phrase.chinese}
            romanization={currentPhrase.phrase.romanization}
            english={currentPhrase.phrase.english}
            tone={currentPhrase.phrase.tone}
          />
        </div>
        
        {/* Tone Ladder */}
        <div className="flex justify-center mb-6">
          <ToneLadder tone={currentPhrase.phrase.tone} showLabel />
        </div>
        
        {/* Audio Play Button with UX Feedback */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <PlayButton 
            onClick={handlePlay} 
            size="lg" 
            isPlaying={isPlaying}
            isLoading={isLoading}
          />
          <span className={`text-sm ${isPlaying ? 'text-brand-brown animate-pulse' : 'text-gray-400'}`}>
            {isLoading ? 'Loading...' : isPlaying ? '🔊 Playing...' : 'Tap to hear pronunciation'}
          </span>
        </div>

        {/* Audio Resources Panel - Dev Mode */}
        {devMode && (
          <AudioResourcesPanel lessonId={lessonId} />
        )}

        {/* Audio Resources Note */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Tone Training Focus</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Focus on the <strong>visual tone ladder</strong> and practice speaking with the microphone. 
                Authentic Hokkien recordings coming soon!
              </p>
            </div>
          </div>
        </Card>
        
        {/* Pronunciation Practice */}
        <Card className="mb-6">
          <h3 className="font-semibold mb-4 text-center">🎤 Practice Pronunciation</h3>
          <Button 
            onClick={start} 
            variant="secondary" 
            className="w-full mb-4"
            disabled={isListening || !supportCheck()}
          >
            {isListening ? '🎧 Listening...' : '🎤 Tap to Record'}
          </Button>
          
          {result && (
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                "{result.transcript}"
              </div>
              <div className="text-sm text-gray-500 mb-2">Your match: {result.matchPercentage}%</div>
              <div className={`text-lg font-bold ${
                result.matchPercentage >= 80 ? 'text-green-500' : 
                result.matchPercentage >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {result.matchPercentage >= 80 ? '✓ Excellent!' : 
                 result.matchPercentage >= 60 ? '○ Good try!' : 
                 'Keep practicing!'}
              </div>
            </div>
          )}
          
          {result?.matchPercentage === undefined && !isListening && (
            <p className="text-xs text-gray-400 text-center">
              {supportCheck() ? 'Tap the button and say the phrase' : 'Speech recognition not supported'}
            </p>
          )}
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="secondary" 
            onClick={onPrev}
            disabled={vocabIndex === 0}
          >
            ← Previous
          </Button>
          
          <Button onClick={onNext}>
            {vocabIndex === lesson.vocabulary.length - 1 
              ? (lesson.dialogue ? 'Next: Dialogue →' : 'Next →')
              : 'Next Phrase →'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

// Dialogue Section Component
function DialogueSection({
  dialogue,
  onComplete,
  onBack,
  onExit,
}: {
  dialogue: any;
  onComplete: () => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const { isPlaying, isLoading, play, stop } = useAudio();
  const [currentLine, setCurrentLine] = useState(0);
  const progress = ((currentLine + 1) / dialogue.lines.length) * 100;

  const handlePlayLine = () => {
    if (isPlaying) {
      stop();
    } else {
      play(dialogue.lines[currentLine].chinese);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            ← Back
          </button>
          <span className="text-sm text-gray-500">
            {currentLine + 1}/{dialogue.lines.length}
          </span>
        </div>
        
        {/* Progress */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div 
            className="bg-brand-brown h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">{dialogue.title}</h2>
        </div>
        
        {/* Dialogue */}
        <Card className="mb-6">
          {dialogue.lines.slice(0, currentLine + 1).map((line: any, index: number) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg mb-2 ${
                line.speaker === 'A' 
                  ? 'bg-brand-brown/10 ml-8' 
                  : 'bg-gray-100 dark:bg-gray-700 mr-8'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">{line.speaker}</div>
              <div className="text-lg font-medium mb-1">{line.chinese}</div>
              <div className="text-sm text-gray-500 mb-1">{line.romanization}</div>
              <div className="text-sm text-gray-400 italic">{line.english}</div>
            </div>
          ))}
          
          {currentLine < dialogue.lines.length - 1 && (
            <button
              onClick={() => setCurrentLine(currentLine + 1)}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              Show more →
            </button>
          )}
        </Card>
        
        {/* Audio Button with UX Feedback */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <PlayButton 
            onClick={handlePlayLine}
            size="lg"
            isPlaying={isPlaying}
            isLoading={isLoading}
          />
          <span className={`text-sm ${isPlaying ? 'text-brand-brown animate-pulse' : 'text-gray-400'}`}>
            {isLoading ? 'Loading...' : isPlaying ? '🔊 Playing...' : 'Tap to hear this line'}
          </span>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <Button onClick={onComplete}>
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
}

// Quiz Section Component
function QuizSection({
  questions,
  answers,
  onAnswer,
  onComplete,
  onBack,
  onExit,
}: {
  questions: any[];
  answers: Record<string, number>;
  onAnswer: (id: string, index: number) => void;
  onComplete: () => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const currentQuestion = questions[currentQ];

  const allAnswered = answeredCount === questions.length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            ← Back
          </button>
          <span className="text-sm text-gray-500">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        
        {/* Progress */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div 
            className="bg-brand-brown h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Question */}
        {currentQuestion && (
          <Card className="mb-6">
            <h3 className="font-semibold mb-4">{currentQuestion.question}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => onAnswer(currentQuestion.id, index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === index
                      ? 'border-brand-brown bg-brand-brown/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="inline-block w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full text-center leading-8 mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </Card>
        )}
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          {allAnswered ? (
            <Button onClick={onComplete}>
              Complete Quiz →
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentQ(currentQ + 1)}
              disabled={answers[currentQuestion.id] === undefined}
            >
              Next Question →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Completion Screen Component
function CompletionScreen({
  lesson,
  xpEarned,
  quizScore,
  onContinue,
  onExit,
}: {
  lesson: Lesson;
  xpEarned: number;
  quizScore?: number;
  onContinue: () => void;
  onExit: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Lesson Complete!</h1>
        <div className="text-3xl font-bold text-tone-1 mb-6">+{xpEarned} XP</div>
        
        {quizScore !== undefined && (
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Quiz Score</div>
            <div className={`text-2xl font-bold ${
              quizScore >= 80 ? 'text-green-500' : 
              quizScore >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {quizScore}%
            </div>
          </div>
        )}
        
        {/* Cultural Note */}
        {lesson.culturalNote && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">📖 Cultural Note</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lesson.culturalNote}
            </p>
          </div>
        )}
        
        <Button onClick={onContinue} className="w-full mb-3 h-12">
          Next Lesson →
        </Button>
        
        <Button variant="secondary" onClick={onExit} className="w-full">
          Return Home
        </Button>
      </Card>
    </div>
  );
}
