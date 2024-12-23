'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchCompletedChallenges, toggleChallenge } from '@/store/slices/challengesSlice';
import ChallengeCard from '@/components/common/ChallengeCard';
import ProgressBar from '@/components/common/ProgressBar';
import SignUp from '@/components/SignUp';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const dsaChallenges: Challenge[] = [
  {
    id: 'dsa1',
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum.',
    difficulty: 'Easy'
  },
  {
    id: 'dsa2',
    title: 'Binary Tree Level Order Traversal',
    description: 'Implement level-order traversal of a binary tree.',
    difficulty: 'Medium'
  },
  {
    id: 'dsa3',
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists into one sorted linked list.',
    difficulty: 'Hard'
  },
];

export default function DSAChallenges() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { completedChallenges, loading } = useSelector((state: RootState) => state.challenges);
  const progress = Math.round((completedChallenges['dsa'].length / dsaChallenges.length) * 100);

  useEffect(() => {
    if (user) {
      dispatch(fetchCompletedChallenges({ userId: user.uid, type: 'dsa' }) as any);
    }
  }, [dispatch, user]);

  const handleToggle = async (challengeId: string) => {
    if (!user) return;

    dispatch(toggleChallenge({
      userId: user.uid,
      userEmail: user.email!,
      type: 'dsa',
      challengeId,
      currentCompleted: completedChallenges['dsa']
    }) as any);
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-400';
      case 'Medium':
        return 'text-purple-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:py-16 sm:px-6 lg:px-8 pt-24 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="flex items-center">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 mr-3 sm:mr-4 flex-shrink-0" />
            <h1 className="text-2xl sm:text-4xl font-bold">DSA Challenges</h1>
          </div>
          <div className="w-full sm:w-auto">
            <ProgressBar 
              progress={progress}
              color="bg-gradient-to-r from-purple-500 to-purple-400"
              textColor="text-purple-400"
            />
          </div>
        </div>

        <SignUp />

        <div className="grid gap-4 sm:gap-6">
          {dsaChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              title={challenge.title}
              description={challenge.description}
              difficulty={challenge.difficulty}
              isCompleted={completedChallenges['dsa'].includes(challenge.id)}
              onToggle={() => handleToggle(challenge.id)}
              difficultyColor={getDifficultyColor(challenge.difficulty)}
              isInitialized={!loading}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
} 