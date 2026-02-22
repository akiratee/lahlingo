'use client';

import { buttonVariants } from './design-system';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'play';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${buttonVariants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface PlayButtonProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isPlaying?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function PlayButton({ onClick, size = 'md', isPlaying = false, isLoading = false, className = '' }: PlayButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-18 h-18',
    lg: 'w-24 h-24',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  // Animated play/pause icon
  const renderIcon = () => {
    if (isLoading) {
      return (
        <svg className={`${iconSizes[size]} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }
    
    if (isPlaying) {
      return (
        <svg className={`${iconSizes[size]}`} fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      );
    }
    
    return (
      <svg className={`${iconSizes[size]} ml-1`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  };
  
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isPlaying}
      className={`
        ${buttonVariants.play}
        ${sizeClasses[size]}
        ${isPlaying ? 'animate-pulse bg-brand-brown/80' : ''}
        ${className}
      `}
    >
      {renderIcon()}
    </button>
  );
}
