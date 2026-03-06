'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, PhraseCard } from '@/components/Card';
import { Button } from '@/components/Button';
import { getDueCards, getCardsByDialect, reviewCard, getReviewStats, FlashCard } from '@/lib/flashcard-review';
import { getStoredProfile } from '@/lib/progress';
import { Dialect } from '@/types';

type ReviewMode = 'dialect' | 'all';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const dialectParam = params.dialect as Dialect | undefined;
  
  const [mode, setMode] = useState<ReviewMode>(dialectParam ? 'dialect' : 'all');
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ total: 0, due: 0, learned: 0, mastery: 0 });
  const [isClient, setIsClient] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState<Dialect>(dialectParam || 'hokkien');

  useEffect(() => {
    setIsClient(true);
    const profile = getStoredProfile();
    if (profile?.selectedDialect) {
      setSelectedDialect(profile.selectedDialect);
    }
    setStats(getReviewStats());
    
    if (dialectParam) {
      setCards(getCardsByDialect(dialectParam as Dialect));
    } else {
      setCards(getDueCards());
    }
  }, [dialectParam]);

  const currentCard = cards[currentIndex];

  const handleRating = (quality: number) => {
    if (!currentCard) return;
    
    reviewCard(currentCard.id, quality);
    
    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Review session complete
      setStats(getReviewStats());
      setCards(mode === 'dialect' ? getCardsByDialect(selectedDialect) : getDueCards());
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  const handleDialectChange = (dialect: Dialect) => {
    setSelectedDialect(dialect);
    setMode('dialect');
    setCards(getCardsByDialect(dialect));
    setCurrentIndex(0);
    setShowAnswer(false);
    router.push(`/learn/review/${dialect}`);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen p-4 bg-amber-50">
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4">All Caught Up!</h2>
            <p className="text-gray-600 mb-6">
              You have no flashcards due for review right now.
              Complete more lessons to add new flashcards!
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push(`/learn/${selectedDialect}`)} className="w-full">
                Start Learning
              </Button>
              <Button onClick={() => router.push('/')} variant="secondary" className="w-full">
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-amber-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Review</h1>
          <div className="text-sm text-gray-600">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-2 mb-4 text-sm">
          <div className="flex-1 bg-white rounded-lg p-2 text-center">
            <div className="font-bold text-amber-600">{stats.due}</div>
            <div className="text-gray-500">Due</div>
          </div>
          <div className="flex-1 bg-white rounded-lg p-2 text-center">
            <div className="font-bold text-green-600">{stats.learned}</div>
            <div className="text-gray-500">Learned</div>
          </div>
          <div className="flex-1 bg-white rounded-lg p-2 text-center">
            <div className="font-bold text-purple-600">{stats.mastery}</div>
            <div className="text-gray-500">Mastered</div>
          </div>
        </div>

        {/* Dialect selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(['hokkien', 'teochew', 'cantonese', 'hakka'] as Dialect[]).map(d => (
            <button
              key={d}
              onClick={() => handleDialectChange(d)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedDialect === d
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Flashcard */}
        <Card className="p-6 min-h-[300px] flex flex-col">
          <div className="text-sm text-gray-500 mb-2">
            {currentCard?.lessonTitle}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {currentCard && (
              <div className="text-center w-full">
                <div className="text-4xl mb-4">{currentCard.phrase.chinese}</div>
                
                {showAnswer ? (
                  <>
                    <div className="text-2xl text-amber-700 mb-2">
                      {currentCard.phrase.romanization}
                    </div>
                    <div className="text-lg text-gray-600">
                      {currentCard.phrase.english}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Tone {currentCard.phrase.tone}
                    </div>
                  </>
                ) : (
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    className="mt-4"
                  >
                    Show Answer
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Rating buttons */}
          {showAnswer && (
            <div className="mt-6">
              <p className="text-center text-sm text-gray-500 mb-3">How well did you know this?</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRating(0)}
                  className="p-2 rounded bg-red-100 text-red-700 text-sm font-medium"
                >
                  Forgot
                </button>
                <button
                  onClick={() => handleRating(2)}
                  className="p-2 rounded bg-orange-100 text-orange-700 text-sm font-medium"
                >
                  Hard
                </button>
                <button
                  onClick={() => handleRating(3)}
                  className="p-2 rounded bg-green-100 text-green-700 text-sm font-medium"
                >
                  Good
                </button>
                <button
                  onClick={() => handleRating(5)}
                  className="p-2 rounded bg-blue-100 text-blue-700 text-sm font-medium"
                >
                  Easy
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Exit button */}
        <Button 
          onClick={() => router.push('/')} 
          variant="secondary" 
          className="w-full mt-4"
        >
          Exit Review
        </Button>
      </div>
    </div>
  );
}
