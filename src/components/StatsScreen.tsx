'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { calculateLearningStats, getStreakDescription, getLevelDescription, getXPForNextLevel, getWeeklyTrend, LearningStats } from '@/lib/stats';
import { Dialect, DIALECT_INFO } from '@/types';

interface StatsScreenProps {
  onBack: () => void;
}

export function StatsScreen({ onBack }: StatsScreenProps) {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [xpInfo, setXPInfo] = useState({ current: 0, needed: 0, percent: 0 });
  const [weeklyTrend, setWeeklyTrend] = useState({ direction: 'up' as 'up' | 'down' | 'stable', percentage: 0 });

  useEffect(() => {
    setStats(calculateLearningStats());
    setXPInfo(getXPForNextLevel(calculateLearningStats().currentLevel));
    setWeeklyTrend(getWeeklyTrend());
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-amber-50 p-4 flex items-center justify-center">
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-900">📊 Learning Stats</h1>
          <Button variant="secondary" onClick={onBack}>← Back</Button>
        </div>

        {/* Level Progress Card */}
        <Card className="mb-4 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h2 className="text-xl font-bold text-amber-900">Level {stats.currentLevel}</h2>
            <p className="text-sm text-amber-700">{getLevelDescription(stats.currentLevel)}</p>
            
            {/* XP Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-amber-800 mb-1">
                <span>{stats.totalXPEarned} XP</span>
                <span>{xpInfo.needed > 0 ? `${xpInfo.needed} XP to next level` : 'Max level!'}</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div 
                  className="bg-amber-500 h-3 rounded-full transition-all"
                  style={{ width: `${xpInfo.percent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Streak Card */}
        <Card className="mb-4 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h2 className="text-xl font-bold text-red-900">{stats.currentStreak} Day Streak</h2>
            <p className="text-sm text-red-700">{getStreakDescription(stats.currentStreak)}</p>
            <div className="mt-3 flex justify-center gap-4 text-sm">
              <span className="text-red-800">Best: {stats.longestStreak} days</span>
              <span className="text-red-800">🛡️ {stats.streakFreezesRemaining} freezes</span>
            </div>
          </div>
        </Card>

        {/* Weekly Activity Card */}
        <Card className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="font-bold text-green-900 mb-3">📅 This Week</h3>
          <div className="flex justify-between items-end h-24 gap-1">
            {stats.weeklyMinutes.map((minutes, i) => {
              const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
              const dayIndex = new Date();
              dayIndex.setDate(dayIndex.getDate() - (6 - i));
              const maxMinutes = Math.max(...stats.weeklyMinutes, 1);
              const height = (minutes / maxMinutes) * 100;
              
              return (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-green-400 rounded-t transition-all"
                    style={{ height: `${height}%`, minHeight: minutes > 0 ? '4px' : '0' }}
                  />
                  <span className="text-xs text-green-800 mt-1">{dayNames[dayIndex.getDay()]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-center">
            {weeklyTrend.direction === 'up' && (
              <span className="text-green-600 text-sm">📈 Up {weeklyTrend.percentage}% from last week!</span>
            )}
            {weeklyTrend.direction === 'down' && (
              <span className="text-orange-600 text-sm">📉 Down {weeklyTrend.percentage}% from last week</span>
            )}
            {weeklyTrend.direction === 'stable' && (
              <span className="text-green-600 text-sm">📊 Stable from last week</span>
            )}
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="text-center">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-2xl font-bold text-amber-900">{stats.totalLessonsCompleted}</div>
            <div className="text-xs text-amber-700">Lessons Completed</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-2xl font-bold text-amber-900">{stats.totalAchievementsEarned}/{stats.totalAchievements}</div>
            <div className="text-xs text-amber-700">Achievements</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-2xl font-bold text-amber-900">{stats.averageQuizScore || '-'}</div>
            <div className="text-xs text-amber-700">Avg. Quiz Score</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-amber-900">{stats.dailyGoalMet}</div>
            <div className="text-xs text-amber-700">Goals Met</div>
          </Card>
        </div>

        {/* Dialect Progress */}
        <Card className="mb-4">
          <h3 className="font-bold text-amber-900 mb-3">🗣️ Dialects Explored</h3>
          {Object.entries(stats.lessonsByDialect).map(([dialect, count]) => (
            <div key={dialect} className="flex justify-between items-center mb-2">
              <span className="text-amber-800">{DIALECT_INFO[dialect as keyof typeof DIALECT_INFO].name}</span>
              <span className="font-bold text-amber-900">{count} lessons</span>
            </div>
          ))}
          {stats.favoriteDialect && (
            <div className="mt-3 pt-3 border-t border-amber-200 text-center">
              <span className="text-amber-800">Favorite: </span>
              <span className="font-bold text-amber-900">{DIALECT_INFO[stats.favoriteDialect].name}</span>
            </div>
          )}
        </Card>

        {/* Time Stats */}
        <Card className="mb-4">
          <h3 className="font-bold text-amber-900 mb-3">⏱️ Learning Journey</h3>
          <div className="flex justify-between mb-2">
            <span className="text-amber-800">Days since start</span>
            <span className="font-bold text-amber-900">{stats.daysSinceStart} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-800">Active days</span>
            <span className="font-bold text-amber-900">{stats.totalDaysActive} days</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
