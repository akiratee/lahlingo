'use client';

import { ReactNode } from 'react';

// Skeleton loader for cards
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#262320] rounded-xl border border-[#E5E2DB] dark:border-[#3D3A35] p-4 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// Skeleton for lesson cards
export function SkeletonLessonCard() {
  return (
    <div className="bg-white dark:bg-[#262320] rounded-xl border border-[#E5E2DB] dark:border-[#3D3A35] p-4">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
}

// Inline loading spinner
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };
  
  return (
    <div className={`${sizes[size]} border-2 border-gray-300 dark:border-gray-600 border-t-brand-brown rounded-full animate-spin ${className}`} />
  );
}

// Button with loading state
interface LoadingButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function LoadingButton({ 
  children, 
  isLoading = false, 
  loadingText,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  onClick
}: LoadingButtonProps) {
  const baseStyles = buttonVariants[variant];
  const isDisabled = disabled || isLoading;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${className}
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          {loadingText || 'Loading...'}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Progress bar with animation
export function ProgressBar({ 
  value, 
  max = 100, 
  className = '',
  showLabel = false,
  size = 'md'
}: { 
  value: number; 
  max?: number; 
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heights[size]} overflow-hidden`}>
        <div 
          className="bg-brand-brown h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-500 mt-1 text-right">{Math.round(percentage)}%</div>
      )}
    </div>
  );
}

// Fade in wrapper for smooth content appearance
export function FadeIn({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Slide up wrapper
export function SlideUp({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <div 
      className={`animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Import buttonVariants for LoadingButton
import { buttonVariants } from './design-system';
