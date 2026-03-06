'use client';

import { toneLadderData } from './design-system';

interface ToneLadderProps {
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ToneLadder({ tone, size = 'md', showLabel = true }: ToneLadderProps) {
  const toneData = toneLadderData[tone];
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };
  
  const colorClasses: Record<1|2|3|4|5|6|7|8, string> = {
    1: 'text-tone-1',
    2: 'text-tone-2',
    3: 'text-tone-3',
    4: 'text-tone-4',
    5: 'text-tone-5',
    6: 'text-tone-6',
    7: 'text-tone-7',
    8: 'text-tone-8',
  };
  
  return (
    <div className="flex flex-col items-center">
      {showLabel && (
        <span className={`${sizeClasses[size]} ${colorClasses[tone]} font-medium mb-1`}>
          {toneData.label}
        </span>
      )}
      <div className={`${sizeClasses[size]} ${colorClasses[tone]} font-mono tracking-wider`}>
        {toneData.contour.repeat(8)}
      </div>
    </div>
  );
}

interface ToneSelectorProps {
  selectedTone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  onSelect: (tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => void;
}

export function ToneSelector({ selectedTone, onSelect }: ToneSelectorProps) {
  const tones: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)[] = [1, 2, 3, 4, 5, 6, 7, 8];
  
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {tones.map((tone) => (
        <button
          key={tone}
          onClick={() => onSelect(tone)}
          className={`
            w-12 h-12 rounded-lg border-2 flex items-center justify-center
            font-mono font-bold text-lg
            transition-all duration-200
            ${selectedTone === tone 
              ? `border-${toneLadderData[tone].color} bg-${toneLadderData[tone].color}/10 text-${toneLadderData[tone].color}`
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }
          `}
        >
          {tone}
        </button>
      ))}
    </div>
  );
}

// Visual representation of all tones
export function ToneComparisonGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="text-center">
        <ToneLadder tone={1} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={2} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={3} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={4} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={5} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={6} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={7} size="sm" />
      </div>
      <div className="text-center">
        <ToneLadder tone={8} size="sm" />
      </div>
    </div>
  );
}
