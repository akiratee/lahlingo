'use client';

import { ReactNode } from 'react';
import { cardVariants } from './design-system';

interface CardProps {
  children: ReactNode;
  variant?: 'lesson' | 'phrase' | 'achievement';
  className?: string;
  onClick?: () => void;
}

export function Card({ children, variant = 'lesson', className = '', onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        ${cardVariants[variant]}
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface PhraseCardProps {
  chinese: string;
  romanization: string;
  english: string;
  tone?: 1 | 2 | 3 | 5 | 6 | 7;
  onPlay?: () => void;
  onFavorite?: () => void;
}

export function PhraseCard({ 
  chinese, 
  romanization, 
  english, 
  tone,
  onPlay,
  onFavorite 
}: PhraseCardProps) {
  return (
    <Card variant="phrase" className="text-center">
      {/* Chinese */}
      <div className="text-4xl font-serif mb-2">{chinese}</div>
      
      {/* Romanization */}
      <div className="font-mono text-xl text-gray-600 dark:text-gray-400 mb-1">
        {romanization}
      </div>
      
      {/* Tone indicator if provided */}
      {tone && (
        <div className="text-sm text-tone-1 mb-2">
          Tone {tone}
        </div>
      )}
      
      {/* English */}
      <div className="text-gray-500 dark:text-gray-400 mb-4">{english}</div>
      
      {/* Actions */}
      <div className="flex justify-center gap-4">
        {onPlay && (
          <button 
            onClick={onPlay}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
        {onFavorite && (
          <button 
            onClick={onFavorite}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>
    </Card>
  );
}

interface LessonCardProps {
  title: string;
  subtitle: string;
  duration: string;
  progress?: number;
  onClick?: () => void;
}

export function LessonCard({ 
  title, 
  subtitle, 
  duration, 
  progress, 
  onClick 
}: LessonCardProps) {
  return (
    <Card variant="lesson" onClick={onClick}>
      <div className="font-semibold text-lg mb-1">{title}</div>
      <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">{subtitle}</div>
      <div className="text-xs text-gray-400 mb-3">{duration}</div>
      
      {progress !== undefined && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-brand-brown h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Card>
  );
}

interface AchievementCardProps {
  icon: string;
  title: string;
  xp?: number;
}

export function AchievementCard({ icon, title, xp }: AchievementCardProps) {
  return (
    <Card variant="achievement" className="w-24 h-24 flex flex-col items-center justify-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xs font-medium truncate w-full px-1">{title}</div>
      {xp && <div className="text-xs text-tone-1">+{xp} XP</div>}
    </Card>
  );
}
