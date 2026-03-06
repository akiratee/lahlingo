'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, LessonCard, AchievementCard } from '@/components/Card';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Loading';
import { QuickToneDrill } from '@/components/ToneDrill';
import { 
  getStoredProfile, 
  saveProfile, 
  getStoredProgress, 
  getCompletedLessonsCount,
  getTotalXP,
  calculateLevel,
  xpProgressInLevel,
  xpToNextLevel,
  getDailyGoalProgress,
  getStreakStatus,
  getWeeklyActivityForDisplay
} from '@/lib/progress';
import { UNITS, getLessonsByUnit } from '@/lib/lessons';
import { getReviewStats } from '@/lib/flashcard-review';
import { hasCompletedTodayChallenge, getTimeUntilNextChallenge } from '@/lib/daily-challenge';
import { UserProfile, Level } from '@/types';
import { LEVEL_INFO, DIALECT_INFO } from '@/types';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [dailyGoal, setDailyGoal] = useState({ minutes: 0, goal: 10, percent: 0, goalMet: false, lessonsCompleted: 0 });
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; minutes: number; isToday: boolean }[]>([]);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const storedProfile = getStoredProfile();
    if (storedProfile) {
      setProfile(storedProfile);
      setCompletedLessons(getCompletedLessonsCount());
      setTotalXP(getTotalXP());
      setDailyGoal(getDailyGoalProgress());
      setWeeklyActivity(getWeeklyActivityForDisplay());
      setDueCardsCount(getReviewStats().due);
      setDailyChallengeCompleted(hasCompletedTodayChallenge());
      setTimeUntilNext(getTimeUntilNextChallenge());
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
            {/* Streak Freezes */}
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <span className="text-lg">❄️</span>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {profile.streakFreezes || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <div className="text-right">
                <div className="text-2xl font-bold">Lv.{level}</div>
                <div className="text-xs text-gray-500">{totalXP} XP</div>
              </div>
            </div>
          </div>
          {/* Longest Streak */}
          {profile.longestStreak > 0 && profile.longestStreak > profile.streak && (
            <div className="text-xs text-gray-400 mb-2">
              🏆 Longest streak: {profile.longestStreak} days
            </div>
          )}
          
          {/* Streak Status Message */}
          {(() => {
            const status = getStreakStatus(profile);
            return status.message && (
              <div className={`text-xs px-2 py-1 rounded ${status.isAtRisk ? 'bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'text-gray-500'}`}>
                {status.message}
              </div>
            );
          })()}
          
          {/* XP Progress */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-brand-brown h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, xpInLevel)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 text-right">{xpNeeded} XP to next level</div>
        </Card>
        
        {/* Daily Goal Card */}
        <Card className={`mb-6 ${dailyGoal.goalMet ? 'bg-green-50 border-2 border-green-400' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold">Daily Goal</div>
                <div className="text-xs text-gray-500">{dailyGoal.goal} min/day</div>
              </div>
            </div>
            {dailyGoal.goalMet ? (
              <div className="text-green-600 font-bold text-lg">✓ Complete!</div>
            ) : (
              <div className="text-right">
                <div className="text-xl font-bold">{dailyGoal.minutes}/{dailyGoal.goal}</div>
                <div className="text-xs text-gray-500">minutes</div>
              </div>
            )}
          </div>
          
          {/* Daily Goal Progress */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all ${dailyGoal.goalMet ? 'bg-green-500' : 'bg-brand-brown'}`}
              style={{ width: `${dailyGoal.percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{dailyGoal.lessonsCompleted} lesson{dailyGoal.lessonsCompleted !== 1 ? 's' : ''} today</span>
            <span>{dailyGoal.percent}%</span>
          </div>
        </Card>
        
        {/* Continue Learning */}
        <Card className="mb-6 bg-brand-brown text-white dark:bg-[#6A482A]">
          <h2 className="text-lg font-semibold mb-2">Continue Learning</h2>
          <p className="text-white/80 text-sm mb-4">Pick up where you left off</p>
          
          <Link href="/learn/hokkien/1/1">
            <Button className="w-full bg-white text-brand-brown hover:bg-gray-100 mb-2">
              Resume Lesson →
            </Button>
          </Link>
          
          <Link href="/learn/review">
            <Button className="w-full bg-white/20 text-white hover:bg-white/30 mb-2">
              🔄 Review Flashcards {dueCardsCount > 0 ? `(${dueCardsCount} due)` : '→'}
            </Button>
          </Link>
          
          <Link href="/learn/favorites">
            <Button className="w-full bg-white/20 text-white hover:bg-white/30">
              ⭐ My Favorites →
            </Button>
          </Link>
          
          <Link href="/learn/vocabulary">
            <Button className="w-full bg-white/20 text-white hover:bg-white/30 mt-2 text-sm">
              📖 My Vocabulary →
            </Button>
          </Link>
          
          {/* Quick Tone Drill - inline component */}
          <div className="mt-2">
            <QuickToneDrill />
          </div>
          
          {/* Daily Challenge */}
          {dailyChallengeCompleted ? (
            <div className="mt-2 bg-green-500/20 text-green-300 py-2 px-4 rounded-lg text-sm font-medium text-center">
              ✓ Daily Challenge Complete! 🎉
            </div>
          ) : (
            <Link href="/learn/daily">
              <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 mt-2 font-bold">
                🌟 Daily Challenge → (Bonus XP!)
              </Button>
            </Link>
          )}
          
          <Link href="/learn/drill">
            <Button className="w-full bg-white/10 text-white hover:bg-white/20 mt-2 text-sm">
              🎯 More Drills →
            </Button>
          </Link>
          
          <Link href="/learn/quiz">
            <Button className="w-full bg-white/10 text-white hover:bg-white/20 mt-2 text-sm">
              📝 Quick Quiz →
            </Button>
          </Link>
          
          <Link href="/learn/review/quick">
            <Button className="w-full bg-white/10 text-white hover:bg-white/20 mt-2 text-sm">
              🔤 Quick Review →
            </Button>
          </Link>
          
          <button 
            onClick={() => onNavigate('stats')}
            className="w-full bg-white/20 text-white hover:bg-white/30 mt-2 py-2 px-4 rounded-lg text-sm font-medium"
          >
            📊 View All Stats →
          </button>
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
            {weeklyActivity.map((dayData, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  dayData.minutes > 0
                    ? 'bg-brand-brown text-white' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {dayData.day}
                </div>
                {dayData.minutes > 0 && (
                  <div className="text-xs text-brand-brown mt-1 font-medium">
                    {dayData.minutes}m
                  </div>
                )}
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
