'use client';

import { VocabularyListScreen } from '@/components/VocabularyListScreen';
import { useRouter } from 'next/navigation';

export default function VocabularyPage() {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  };
  
  return <VocabularyListScreen onBack={handleBack} />;
}
