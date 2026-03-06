'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Loading';
import { getLearnedVocabulary, LearnedVocabulary } from '@/lib/progress';
import { TONE_CONFIGS } from '@/types';

interface VocabularyListScreenProps {
  onBack: () => void;
}

type SortOption = 'recent' | 'alphabetical' | 'tone';

export function VocabularyListScreen({ onBack }: VocabularyListScreenProps) {
  const [vocabulary, setVocabulary] = useState<LearnedVocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTone, setSelectedTone] = useState<number | null>(null);

  useEffect(() => {
    const vocab = getLearnedVocabulary();
    setVocabulary(vocab);
    setLoading(false);
  }, []);

  const filteredVocabulary = vocabulary.filter(vocab => {
    // Filter by search query
    const matchesSearch = searchQuery === '' ||
      vocab.chinese.includes(searchQuery) ||
      vocab.romanization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.english.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tone
    const matchesTone = selectedTone === null || vocab.tone === selectedTone;
    
    return matchesSearch && matchesTone;
  }).sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    } else if (sortBy === 'alphabetical') {
      return a.romanization.localeCompare(b.romanization);
    } else if (sortBy === 'tone') {
      return a.tone - b.tone;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816]">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-2xl">←</button>
          <h1 className="text-xl font-bold">📖 My Vocabulary</h1>
        </div>

        {/* Stats Card */}
        <Card className="mb-4 bg-brand-brown text-white">
          <div className="text-center">
            <div className="text-4xl font-bold">{vocabulary.length}</div>
            <div className="text-white/80">Words Learned</div>
          </div>
        </Card>

        {/* Search */}
        {vocabulary.length > 0 && (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                <option value="tone">By Tone</option>
              </select>
              
              {/* Tone filter buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedTone(null)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    selectedTone === null 
                      ? 'bg-brand-brown text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  All
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(tone => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium ${
                      selectedTone === tone 
                        ? 'text-white' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                    style={selectedTone !== tone ? { 
                      backgroundColor: TONE_CONFIGS[tone as keyof typeof TONE_CONFIGS]?.color + '20',
                      color: TONE_CONFIGS[tone as keyof typeof TONE_CONFIGS]?.color
                    } : {}}
                  >
                    T{tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-500 mb-2">
              Showing {filteredVocabulary.length} of {vocabulary.length} words
            </div>

            {/* Vocabulary List */}
            <div className="space-y-2 mb-20">
              {filteredVocabulary.map((vocab) => (
                <Card key={vocab.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold">{vocab.chinese}</span>
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: TONE_CONFIGS[vocab.tone as keyof typeof TONE_CONFIGS]?.color }}
                        >
                          T{vocab.tone}
                        </span>
                      </div>
                      <div className="text-lg text-brand-brown dark:text-brand-brown-light font-medium">
                        {vocab.romanization}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {vocab.english}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        From: {vocab.lessonTitle}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {vocabulary.length === 0 && (
          <Card className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-lg font-semibold mb-2">No vocabulary yet!</h2>
            <p className="text-gray-500 mb-4">
              Complete lessons to build your vocabulary book.
            </p>
            <Button onClick={onBack} className="bg-brand-brown text-white">
              Start Learning →
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
