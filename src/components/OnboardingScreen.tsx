'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { saveProfile, getStoredProfile } from '@/lib/progress';
import { UserProfile, Dialect, Level } from '@/types';
import { DIALECT_INFO, LEVEL_INFO } from '@/types';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<'welcome' | 'dialect' | 'level' | 'name' | 'goal'>('welcome');
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('hokkien');
  const [selectedLevel, setSelectedLevel] = useState<Level>('beginner');
  const [name, setName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(10);

  const handleStart = () => setStep('dialect');
  
  const handleDialectSelect = (dialect: Dialect) => {
    setSelectedDialect(dialect);
    setStep('level');
  };
  
  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setStep('name');
  };
  
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('goal');
    }
  };
  
  const handleGoalSelect = (goal: number) => {
    setDailyGoal(goal);
    
    // Create user profile
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      selectedDialect,
      dailyGoalMinutes: goal,
      level: 1,
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      createdAt: new Date().toISOString(),
    };
    
    saveProfile(profile);
    onComplete();
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="text-6xl mb-4">🦥</div>
          <h1 className="text-4xl font-bold mb-2 text-brand-brown dark:text-[#D4A574]">LahLingo</h1>
          <p className="text-gray-500 mb-8">
            Learn Singapore dialects, lah!<br />
            Hokkien • Teochew • Cantonese • Hakka
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3 text-left">
              <span className="text-2xl">🎯</span>
              <span className="text-sm">Master tones with visual guides</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-left">
              <span className="text-2xl">🗣️</span>
              <span className="text-sm">Practice with speech recognition</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-left">
              <span className="text-2xl">🏆</span>
              <span className="text-sm">Track progress with XP and streaks</span>
            </div>
          </div>
          
          <Button onClick={handleStart} className="w-full h-14 text-lg">
            Get Started
          </Button>
        </Card>
      </div>
    );
  }

  // Dialect Selection Screen
  if (step === 'dialect') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Choose Your Dialect</h1>
          <p className="text-gray-500 mb-6">What dialect would you like to learn?</p>
          
          <div className="space-y-3">
            {(Object.entries(DIALECT_INFO) as [Dialect, typeof DIALECT_INFO.hokkien][]).map(([key, info]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedDialect === key 
                    ? 'ring-2 ring-brand-brown bg-brand-brown/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleDialectSelect(key)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-brown text-white flex items-center justify-center text-xl">
                    {key === 'hokkien' ? '🇸🇬' : 
                     key === 'teochew' ? '🇨🇳' : 
                     key === 'cantonese' ? '🇭🇰' : '🏯'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{info.name} • {info.chinese}</h3>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                  {selectedDialect === key && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Level Selection Screen
  if (step === 'level') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">How much do you know?</h1>
          <p className="text-gray-500 mb-6">Help us personalize your learning path</p>
          
          <div className="space-y-3">
            {(Object.entries(LEVEL_INFO) as [Level, typeof LEVEL_INFO.beginner][]).map(([key, info]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedLevel === key 
                    ? 'ring-2 ring-brand-brown bg-brand-brown/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleLevelSelect(key)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{info.label}</h3>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                  {selectedLevel === key && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Name Input Screen
  if (step === 'name') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">What should we call you?</h1>
          <p className="text-gray-500 mb-6">Your name will be displayed on your profile</p>
          
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 text-lg border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-brown"
              autoFocus
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!name.trim()}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Daily Goal Screen
  if (step === 'goal') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Daily Goal</h1>
          <p className="text-gray-500 mb-6">How much time can you dedicate each day?</p>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[5, 10, 15].map(goal => (
              <Card
                key={goal}
                className={`cursor-pointer text-center py-6 transition-all ${
                  dailyGoal === goal 
                    ? 'ring-2 ring-brand-brown bg-brand-brown/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleGoalSelect(goal)}
              >
                <div className="text-3xl font-bold mb-1">{goal}</div>
                <div className="text-sm text-gray-500">min/day</div>
              </Card>
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-400">
            You can change this anytime in settings
          </div>
        </div>
      </div>
    );
  }

  return null;
}
