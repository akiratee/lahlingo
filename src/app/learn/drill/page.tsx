'use client';

import { ToneDrill } from '@/components/ToneDrill';
import Link from 'next/link';

export default function DrillPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1816] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="text-2xl">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold">🎯 Tone Drill</h1>
            <p className="text-gray-500">Master your tones</p>
          </div>
        </div>
        
        {/* Drill Component */}
        <ToneDrill />
      </div>
    </div>
  );
}
