'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getFavorites, getFavoriteLessons, removeFromFavorites } from '@/lib/progress';
import { getLessonById } from '@/lib/lessons';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteData, setFavoriteData] = useState<{ lessonId: string; addedAt: string }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorites(getFavorites());
    setFavoriteData(getFavoriteLessons());
  }, []);

  const handleRemoveFavorite = (lessonId: string) => {
    removeFromFavorites(lessonId);
    setFavorites(getFavorites());
    setFavoriteData(getFavoriteLessons());
  };

  const handlePlayLesson = (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (lesson) {
      router.push(`/learn/${lesson.dialect}/${lesson.unit}/${lesson.lesson}`);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <p>Loading...</p>
          </Card>
        </div>
      </div>
    );
  }

  const favoriteLessons = favoriteData
    .map(f => {
      const lesson = getLessonById(f.lessonId);
      return lesson ? { ...lesson, addedAt: f.addedAt } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ⭐ My Favorites
            </h1>
          </div>
          <span className="text-sm text-gray-500">{favorites.length} lessons</span>
        </div>

        {favoriteLessons.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet!</h2>
            <p className="text-gray-500 mb-6">
              Tap the star on any lesson to add it to your favorites for quick access.
            </p>
            <Button onClick={() => router.push('/learn')}>
              Browse Lessons
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {favoriteLessons.map((lesson: any) => (
              <div key={lesson.id} className="relative">
                <Card 
                  variant="lesson" 
                  onClick={() => handlePlayLesson(lesson.id)}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="font-semibold text-lg mb-1">{lesson.title}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">{lesson.subtitle}</div>
                  <div className="text-xs text-gray-400">{lesson.duration}</div>
                </Card>
                <button
                  onClick={() => handleRemoveFavorite(lesson.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  title="Remove from favorites"
                >
                  ⭐
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
