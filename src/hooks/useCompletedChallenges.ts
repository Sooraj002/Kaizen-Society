'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useLocalStorage } from './useLocalStorage';

export function useCompletedChallenges(type: 'web-dev' | 'dsa', totalChallenges: number) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [localCompleted, setLocalCompleted, isInitialized] = useLocalStorage<string[]>(`${type}CompletedChallenges`, []);

  const progress = useMemo(() => {
    if (!isInitialized) return 0;
    return Math.round((localCompleted.length / totalChallenges) * 100);
  }, [localCompleted.length, totalChallenges, isInitialized]);

  useEffect(() => {
    const fetchFromMongoDB = async () => {
      if (user && isInitialized) {
        try {
          const response = await fetch(`/api/completed-challenges?userId=${user.uid}&type=${type}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.completedChallenges) {
            setLocalCompleted(data.completedChallenges);
          }
        } catch (error) {
          console.error('Error fetching completed challenges:', error);
        }
      }
    };

    fetchFromMongoDB();
  }, [user, type, isInitialized, setLocalCompleted]);

  const toggleChallenge = useCallback(async (challengeId: string) => {
    if (!isInitialized) return;

    const newCompleted = localCompleted.includes(challengeId)
      ? localCompleted.filter(id => id !== challengeId)
      : [...localCompleted, challengeId];

    setLocalCompleted(newCompleted);

    if (user) {
      try {
        const response = await fetch('/api/completed-challenges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            type,
            completedChallenges: newCompleted
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Save to MongoDB result:', result);
      } catch (error) {
        console.error('Error saving completed challenges:', error);
        setLocalCompleted(localCompleted);
      }
    }
  }, [isInitialized, localCompleted, setLocalCompleted, type, user]);

  return {
    completedChallenges: isInitialized ? localCompleted : [],
    toggleChallenge,
    isInitialized,
    progress
  };
} 