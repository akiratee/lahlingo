'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LessonPlayer } from '@/components/LessonPlayer';
import { getLessonById } from '@/lib/lessons';
import { getStoredProfile } from '@/lib/progress';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const dialect = params.dialect as string;
  const unit = params.unit as string;
  const lesson = params.lesson as string;
  
  const lessonId = `${dialect}-u${unit}-l${lesson}`;
  
  const handleComplete = (xpEarned: number) => {
    console.log(`Lesson completed! Earned ${xpEarned} XP`);
  };
  
  const handleExit = () => {
    router.push('/');
  };
  
  return (
    <LessonPlayer
      lessonId={lessonId}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}
