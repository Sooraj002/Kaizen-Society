'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code2, Brain } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Challenges = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 pt-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-12">Choose Your Path</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/challenges/web-dev">
            <motion.div
              variants={itemVariants}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-emerald-500/50 transition-colors group cursor-pointer"
            >
              <Code2 className="w-12 h-12 text-emerald-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-4 group-hover:text-emerald-400 transition-colors">
                Web Development
              </h2>
              <p className="text-zinc-400">
                Master modern web development with hands-on projects and challenges.
                From responsive design to full-stack applications.
              </p>
            </motion.div>
          </Link>

          <Link href="/challenges/dsa">
            <motion.div
              variants={itemVariants}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-purple-500/50 transition-colors group cursor-pointer"
            >
              <Brain className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-4 group-hover:text-purple-400 transition-colors">
                Data Structures & Algorithms
              </h2>
              <p className="text-zinc-400">
                Strengthen your problem-solving skills with algorithmic challenges.
                From basic data structures to advanced algorithms.
              </p>
            </motion.div>
          </Link>
        </div>

        {!user && (
          <motion.div
            variants={itemVariants}
            className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-2">Track Your Progress</h2>
            <p className="text-zinc-400 mb-4">
              Sign in to save your progress and sync across devices.
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-lg hover:from-purple-600 hover:to-emerald-600 transition-all"
              >
                Sign In Now
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Challenges;