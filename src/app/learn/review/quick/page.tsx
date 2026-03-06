'use client';

import { QuickReview } from '@/components/QuickReview';
import { useRouter } from 'next/navigation';

export default function QuickReviewPage() {
  const router = useRouter();

  const handleComplete = (xpEarned: number) => {
    console.log(`Quick Review complete! Earned ${xpEarned} XP`);
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <QuickReview onComplete={handleComplete} onExit={handleExit} />
  );
}
