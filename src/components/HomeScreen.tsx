'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, LessonCard, AchievementCard } from '@/components/Card';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Loading';
import { 
  getStoredProfile, 
  saveProfile, 
  getStoredProgress, 
  getCompletedLessonsCount,
  getTotalXP,
  calculateLevel,
  xpProgressInLevel,
  xpToNextLevel
} from '@/lib/progress';
import { UNITS, getLessonsByUnit } from '@/lib/lessons';
import { UserProfile, Level } from '@/types';
import { LEVEL_INFO, DIALECT_INFO } from '@/types';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const storedProfile = getStoredProfile();
    if (storedProfile) {
      setProfile(storedProfile);
      setCompletedLessons(getCompletedLessonsCount());
      setTotalXP(getTotalXP());
    } else {
      // Redirect to onboarding
      onNavigate('welcome');
    }
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const level = calculateLevel(totalXP);
  const xpInLevel = xpProgressInLevel(totalXP, level);
  const xpNeeded = xpToNextLevel(level);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816]">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">👋 Welcome back, {profile.name || 'Learner'}!</h1>
            <p className="text-sm text-gray-500">Keep your streak alive!</p>
          </div>
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center"
          >
            {profile.name?.charAt(0) || '?'}
          </button>
        </div>
        
        {/* Streak & Level Card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔥</span>
              <div>
                <div className="text-2xl font-bold">{profile.streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <div className="text-right">
                <div className="text-2xl font-bold">Lv.{level}</div>
                <div className="text-xs text-gray-500">{totalXP} XP</div>
              </div>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-brand-brown h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, xpInLevel)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 text-right">{xpNeeded} XP to next level</div>
        </Card>
        
        {/* Continue Learning */}
        <Card className="mb-6 bg-brand-brown text-white dark:bg-[#6A482A]">
          <h2 className="text-lg font-semibold mb-2">Continue Learning</h2>
          <p className="text-white/80 text-sm mb-4">Pick up where you left off</p>
          
          <Link href="/learn/hokkien/1/1">
            <Button className="w-full bg-white text-brand-brown hover:bg-gray-100">
              Resume Lesson →
            </Button>
          </Link>
        </Card>
        
        {/* Units */}
        <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
        <div className="space-y-3 mb-6">
          {UNITS.map(unit => {
            const lessons = getLessonsByUnit('hokkien', unit.unit);
            const completedCount = lessons.filter(l => {
              const progress = getStoredProgress();
              return progress?.[l.id]?.completed;
            }).length;
            const progress = Math.round((completedCount / lessons.length) * 100);
            
            return (
              <Link key={unit.id} href={`/learn/hokkien/${unit.unit}/1`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-brand-brown/10 flex items-center justify-center text-xl">
                      {unit.unit === 1 ? '🥚' : unit.unit === 2 ? '🔢' : '👨‍👩‍👧'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Unit {unit.unit}: {unit.title}</h3>
                      <p className="text-sm text-gray-500">{unit.lessons} lessons • {completedCount}/{unit.lessons} completed</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-brand-brown h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {/* Weekly Activity */}
        <h2 className="text-lg font-semibold mb-3">Weekly Activity</h2>
        <Card className="mb-6">
          <div className="flex justify-between">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  i === 1 // Demo: Tuesday active
                    ? 'bg-brand-brown text-white' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {day}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Achievements */}
        <h2 className="text-lg font-semibold mb-3">Recent Achievements</h2>
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <AchievementCard icon="👣" title="First Steps" xp={100} />
          <AchievementCard icon="🎯" title="Getting Started" xp={150} />
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0">
            + More
          </div>
        </div>
        
        {/* Bottom Nav Placeholder */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
