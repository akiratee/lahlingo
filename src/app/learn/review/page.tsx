'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getDueCards, getReviewStats } from '@/lib/flashcard-review';
import { getStoredProfile } from '@/lib/progress';
import { Dialect } from '@/types';

export default function ReviewIndexPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState({ total: 0, due: 0, learned: 0, mastery: 0 });
  const [isClient, setIsClient] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('hokkien');

  useEffect(() => {
    setIsClient(true);
    const profile = getStoredProfile();
    if (profile?.selectedDialect) {
      setSelectedDialect(profile.selectedDialect);
    }
    setStats(getReviewStats());
  }, []);

  const handleStartReview = (dialect?: Dialect) => {
    if (dialect) {
      router.push(`/learn/review/${dialect}`);
    } else {
      // Check if there are any due cards
      const dueCards = getDueCards();
      if (dueCards.length > 0 && dueCards[0]) {
        router.push(`/learn/review/${dueCards[0].dialect}`);
      }
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-amber-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Review</h1>

        {/* Stats overview */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{stats.due}</div>
              <div className="text-sm text-gray-500">Due Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.learned}</div>
              <div className="text-sm text-gray-500">Learned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.mastery}</div>
              <div className="text-sm text-gray-500">Mastered</div>
            </div>
          </div>
        </Card>

        {stats.due > 0 ? (
          <>
            <Button 
              onClick={() => handleStartReview()}
              className="w-full mb-4"
            >
              Start Review ({stats.due} cards due)
            </Button>

            <p className="text-center text-gray-500 mb-4">or review by dialect:</p>

            <div className="space-y-2">
              {(['hokkien', 'teochew', 'cantonese', 'hakka'] as Dialect[]).map(dialect => (
                <Button
                  key={dialect}
                  onClick={() => handleStartReview(dialect)}
                  variant="secondary"
                  className="w-full"
                >
                  {dialect.charAt(0).toUpperCase() + dialect.slice(1)} Review
                </Button>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-6 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-gray-600 mb-4">
              No flashcards due for review. Complete lessons to add new cards!
            </p>
            <Button onClick={() => router.push(`/learn/${selectedDialect}`)}>
              Start Learning
            </Button>
          </Card>
        )}

        <Button 
          onClick={() => router.push('/')} 
          variant="secondary" 
          className="w-full mt-4"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
