'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function SignUp() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg"
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
  );
} 