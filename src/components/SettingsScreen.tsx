'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { isDevMode, setDevMode } from '@/lib/config';
import { resetAllProgress, getStoredProfile, saveProfile, getStoredProgress, saveProgress, getStoredAchievements, saveAchievements, getWeeklyActivity, saveWeeklyActivity, getTriedDialects, saveTriedDialects } from '@/lib/progress';

interface SettingsScreenProps {
  onBack: () => void;
}

// Storage keys for export/import
const STORAGE_KEYS = {
  PROFILE: 'dialect-master-profile',
  PROGRESS: 'dialect-master-progress',
  ACHIEVEMENTS: 'dialect-master-achievements',
  WEEKLY: 'dialect-master-weekly',
  TRIED_DIALECTS: 'dialect-master-tried-dialects',
  DAILY_GOAL: 'dialect-master-daily-goal',
  FAVORITES: 'dialect-master-favorites',
};

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDevModeEnabled(isDevMode());
  }, []);

  const handleToggleDevMode = () => {
    const newValue = !devModeEnabled;
    setDevModeEnabled(newValue);
    setDevMode(newValue);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Export all progress data
  const handleExport = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profile: localStorage.getItem(STORAGE_KEYS.PROFILE),
        progress: localStorage.getItem(STORAGE_KEYS.PROGRESS),
        achievements: localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        weekly: localStorage.getItem(STORAGE_KEYS.WEEKLY),
        triedDialects: localStorage.getItem(STORAGE_KEYS.TRIED_DIALECTS),
        dailyGoal: localStorage.getItem(STORAGE_KEYS.DAILY_GOAL),
        favorites: localStorage.getItem(STORAGE_KEYS.FAVORITES),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lahlingo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: '✅ Progress exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Export failed. Please try again.' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  // Import progress data
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, data.profile);
        if (data.progress) localStorage.setItem(STORAGE_KEYS.PROGRESS, data.progress);
        if (data.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
        if (data.weekly) localStorage.setItem(STORAGE_KEYS.WEEKLY, data.weekly);
        if (data.triedDialects) localStorage.setItem(STORAGE_KEYS.TRIED_DIALECTS, data.triedDialects);
        if (data.dailyGoal) localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, data.dailyGoal);
        if (data.favorites) localStorage.setItem(STORAGE_KEYS.FAVORITES, data.favorites);
        
        setMessage({ type: 'success', text: '✅ Progress imported! Refresh to see changes.' });
      } catch (error) {
        setMessage({ type: 'error', text: '❌ Invalid backup file.' });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  // Reset all progress
  const handleReset = () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
      resetAllProgress();
      // Also clear favorites and daily goal
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.DAILY_GOAL);
      setMessage({ type: 'success', text: '✅ All progress reset! Refresh to start fresh.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Clear only favorites
  const handleClearFavorites = () => {
    if (confirm('Clear all favorites?')) {
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      setMessage({ type: 'success', text: '✅ Favorites cleared!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="w-10" />
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${
            message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {message.text}
          </div>
        )}

        {/* Data Management */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">💾 Data Management</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full p-3 bg-brand-brown text-white rounded-lg hover:bg-brand-brown/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>📤</span>
              <span>Export Progress</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-brown hover:bg-brand-brown/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📥</span>
              <span>Import Progress</span>
            </label>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Export your progress to a file for backup, or import a previous backup.
          </p>
        </Card>

        {/* Developer Mode */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">👨‍💻 Developer Mode</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Enable Developer Tools</p>
              <p className="text-sm text-gray-500">Access testing features and audio resources</p>
            </div>
            <button
              onClick={handleToggleDevMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                devModeEnabled ? 'bg-brand-brown' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  devModeEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {devModeEnabled && (
            <div className="bg-brand-brown/10 p-3 rounded-lg">
              <p className="text-sm text-brand-brown">
                ✅ Developer Mode active. You now have access to advanced testing tools and audio resources.
              </p>
            </div>
          )}
        </Card>

        {/* Clear Data */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">🗑️ Clear Data</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleClearFavorites}
              className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>⭐</span>
              <span>Clear All Favorites</span>
            </button>
            
            <button
              onClick={handleReset}
              className="w-full p-3 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>⚠️</span>
              <span>Reset All Progress</span>
            </button>
          </div>
        </Card>

        {/* Audio Resources Info */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">🔊 Audio Resources</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We're researching authentic Hokkien recordings for the app. 
            Current focus: Visual tone training + speech recognition practice.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🎯 <strong>Tip:</strong> Use the tone ladder to visualize tones 
              and practice speaking with the microphone for feedback.
            </p>
          </div>
        </Card>

        {/* About */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">ℹ️ About</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>LahLingo</strong> v0.1.0</p>
            <p>Learn Singapore dialects, lah!</p>
            <p className="text-xs text-gray-400 mt-2">
              Tagline: Master Hokkien, Teochew, Cantonese & Hakka with tone training
            </p>
          </div>
        </Card>

        {/* Save Indicator */}
        {saved && (
          <div className="fixed bottom-4 right-4 bg-brand-brown text-white px-4 py-2 rounded-lg shadow-lg">
            ✓ Saved!
          </div>
        )}
      </div>
    </div>
  );
}
