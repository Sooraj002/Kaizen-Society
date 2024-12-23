'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  isCompleted: boolean;
  onToggle: () => void;
  difficultyColor: string;
  isInitialized: boolean;
}

export default function ChallengeCard({
  title,
  description,
  difficulty,
  isCompleted,
  onToggle,
  difficultyColor,
  isInitialized,
}: ChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 sm:p-6 relative group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
            {title}
            <span className={`text-sm ${difficultyColor} sm:ml-3`}>
              {difficulty}
            </span>
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base">{description}</p>
        </div>
        <button
          onClick={onToggle}
          disabled={!isInitialized}
          className={`self-end sm:self-start ml-auto sm:ml-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors ${
            !isInitialized ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <CheckCircle2
            className={`w-6 h-6 ${
              isInitialized && isCompleted ? 'text-emerald-400' : 'text-zinc-600'
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
} 