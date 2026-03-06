'use client';

import { useState, useEffect } from 'react';
import { isFavorite, toggleFavorite } from '../lib/progress';

interface FavoritesButtonProps {
  lessonId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoritesButton({ lessonId, size = 'md', showLabel = false }: FavoritesButtonProps) {
  const [favorite, setFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorite(isFavorite(lessonId));
  }, [lessonId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(lessonId);
    setFavorite(newState);
  };

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl',
  };

  const icon = favorite ? '⭐' : '☆';

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none`}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className={favorite ? 'filter drop-shadow-sm' : 'opacity-60'}>{icon}</span>
      {showLabel && (
        <span className="ml-1 text-sm text-amber-700">
          {favorite ? 'Favorited' : 'Add to favorites'}
        </span>
      )}
    </button>
  );
}
