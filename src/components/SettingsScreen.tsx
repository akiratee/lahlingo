'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { isDevMode, setDevMode } from '@/lib/config';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

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
