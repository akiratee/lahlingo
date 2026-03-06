'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
  getStoredProfile, 
  getCompletedLessonsCount, 
  getTotalXP, 
  calculateLevel,
  xpProgressInLevel,
  xpToNextLevel,
  resetAllProgress,
  getEarnedAchievementsCount,
  isAchievementEarned
} from '@/lib/progress';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { UserProfile, Dialect } from '@/types';
import { DIALECT_INFO } from '@/types';
import { isDevMode, setDevMode } from '@/lib/config';

interface ProfileScreenProps {
  onBack: () => void;
  onDialectChange: (dialect: Dialect) => void;
  onOpenSettings?: () => void;
}

export function ProfileScreen({ onBack, onDialectChange, onOpenSettings }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [devMode, setDevModeState] = useState(false);
  const [earnedAchievements, setEarnedAchievements] = useState(0);

  useEffect(() => {
    const storedProfile = getStoredProfile();
    if (storedProfile) {
      setProfile(storedProfile);
      setCompletedLessons(getCompletedLessonsCount());
      setTotalXP(getTotalXP());
      setEarnedAchievements(getEarnedAchievementsCount());
    }
    setDevModeState(isDevMode());
  }, []);

  // Update dev mode state when it changes (e.g., from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      setDevModeState(isDevMode());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleDevMode = () => {
    const newValue = !devMode;
    setDevModeState(newValue);
    setDevMode(newValue); // Save to localStorage via config
    if (newValue) {
      alert('Developer Mode enabled! Access TTS comparison tools in lesson player.');
    }
  };

  if (!profile) {
    return null;
  }

  const level = calculateLevel(totalXP);
  const xpInLevel = xpProgressInLevel(totalXP, level);
  const xpNeeded = xpToNextLevel(level);

  const handleDialectSelect = (dialect: Dialect) => {
    const updatedProfile = { ...profile, selectedDialect: dialect };
    setProfile(updatedProfile);
    // Save to storage
    localStorage.setItem('dialect-master-profile', JSON.stringify(updatedProfile));
    onDialectChange(dialect);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetAllProgress();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816]">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        
        {/* Profile Card */}
        <Card className="mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-brown text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            {profile.name?.charAt(0) || '?'}
          </div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-500">{DIALECT_INFO[profile.selectedDialect].name} Learner</p>
          
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">Lv.{level}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalXP}</div>
              <div className="text-xs text-gray-500">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.streak}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Lv.{level + 1}</span>
              <span>{xpNeeded} XP needed</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-brand-brown h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, xpInLevel)}%` }}
              />
            </div>
          </div>
        </Card>
        
        {/* Stats */}
        <h2 className="text-lg font-semibold mb-3">Statistics</h2>
        <Card className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">🔤</div>
              <div className="text-sm text-gray-500">{completedLessons * 5}+</div>
              <div className="text-xs text-gray-400">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">📚</div>
              <div className="text-sm text-gray-500">{completedLessons}</div>
              <div className="text-xs text-gray-400">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">⏱️</div>
              <div className="text-sm text-gray-500">{completedLessons * 5}</div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
          </div>
        </Card>
        
        {/* Dialect Switcher */}
        <h2 className="text-lg font-semibold mb-3">Dialect</h2>
        <Card className="mb-6">
          <div className="space-y-2">
            {(Object.entries(DIALECT_INFO) as [Dialect, typeof DIALECT_INFO.hokkien][]).map(([key, info]) => (
              <button
                key={key}
                onClick={() => handleDialectSelect(key)}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                  profile.selectedDialect === key 
                    ? 'bg-brand-brown/10 text-brand-brown' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{key === 'hokkien' ? '🇸🇬' : 
                         key === 'teochew' ? '🇨🇳' : 
                         key === 'cantonese' ? '🇭🇰' : '🏯'}</span>
                  <span className="font-medium">{info.name}</span>
                </div>
                {profile.selectedDialect === key && <span>✓</span>}
              </button>
            ))}
          </div>
        </Card>
        
        {/* Achievements */}
        <h2 className="text-lg font-semibold mb-3">Achievements</h2>
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {earnedAchievements}/{ACHIEVEMENTS.length} earned
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {ACHIEVEMENTS.slice(0, 6).map(achievement => {
              const earned = isAchievementEarned(achievement.key);
              return (
                <div 
                  key={achievement.id}
                  className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 ${
                    earned 
                      ? 'border-brand-brown bg-brand-brown/10 opacity-100' 
                      : 'border-gray-200 dark:border-gray-700 opacity-40'
                  }`}
                  title={`${achievement.title}: ${achievement.description}${earned ? ' (Earned!)' : ''}`}
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <span className="text-[8px] leading-tight mt-0.5 line-clamp-2">{achievement.title}</span>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Settings */}
        <h2 className="text-lg font-semibold mb-3">Settings</h2>
        <Card className="mb-6">
          <button className="w-full p-4 text-left flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <span>Daily Goal</span>
            <span className="text-gray-500">{profile.dailyGoalMinutes} min/day →</span>
          </button>
          <button className="w-full p-4 text-left flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <span>Notifications</span>
            <span className="text-gray-500">On →</span>
          </button>
          <button 
            onClick={onOpenSettings}
            className="w-full p-4 text-left flex items-center justify-between border-b border-gray-100 dark:border-gray-700"
          >
            <span>🔊 Text-to-Speech</span>
            <span className="text-gray-500">→</span>
          </button>
          <button 
            onClick={toggleDevMode}
            className="w-full p-4 text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>👨‍💻 Developer Mode</span>
              {devMode && (
                <span className="text-xs px-2 py-0.5 rounded bg-brand-brown text-white">
                  ACTIVE
                </span>
              )}
            </div>
            <span className={`text-xl transition-transform ${devMode ? 'rotate-90' : ''}`}>
              {devMode ? '✅' : '○'}
            </span>
          </button>
        </Card>
        
        {/* Danger Zone */}
        <h2 className="text-lg font-semibold mb-3 text-red-500">Danger Zone</h2>
        <Card className="mb-6 border-red-200">
          <button 
            onClick={handleReset}
            className="w-full p-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Reset All Progress
          </button>
        </Card>
        
        {/* Bottom padding */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
