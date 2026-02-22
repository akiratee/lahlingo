'use client';

import { useState, useEffect } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { LessonPlayer } from '@/components/LessonPlayer';
import { getStoredProfile } from '@/lib/progress';
import { Dialect } from '@/types';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'profile' | 'settings' | 'lesson'>('onboarding');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('hokkien');

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile) {
      setCurrentScreen('home');
      setSelectedDialect(profile.selectedDialect);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'profile') {
      setCurrentScreen('profile');
    } else if (screen === 'home') {
      setCurrentScreen('home');
    } else if (screen === 'settings') {
      setCurrentScreen('settings');
    }
  };

  const handleStartLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentScreen('lesson');
  };

  const handleLessonComplete = (xpEarned: number) => {
    console.log(`Lesson completed! Earned ${xpEarned} XP`);
  };

  const handleLessonExit = () => {
    setCurrentLessonId(null);
    setCurrentScreen('home');
  };

  const handleDialectChange = (dialect: Dialect) => {
    setSelectedDialect(dialect);
  };

  // Show onboarding if no profile
  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show lesson player
  if (currentScreen === 'lesson' && currentLessonId) {
    return (
      <LessonPlayer
        lessonId={currentLessonId}
        onComplete={handleLessonComplete}
        onExit={handleLessonExit}
      />
    );
  }

  // Show settings
  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={() => setCurrentScreen('profile')} />;
  }

  // Show profile
  if (currentScreen === 'profile') {
    return (
      <ProfileScreen 
        onBack={() => setCurrentScreen('home')}
        onDialectChange={handleDialectChange}
        onOpenSettings={() => setCurrentScreen('settings')}
      />
    );
  }

  // Show home screen with lesson navigation
  return (
    <HomeScreen onNavigate={handleNavigate} />
  );
}
