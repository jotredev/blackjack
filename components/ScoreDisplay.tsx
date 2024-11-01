'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  label: string;
  score: number;
  isBlackjack?: boolean;
}

export default function ScoreDisplay({
  label,
  score,
  isBlackjack = false,
}: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center gap-2 text-center bg-black/80 px-6 py-3 rounded-xl backdrop-blur-sm',
        isBlackjack && 'celebrate'
      )}
    >
      <h2 className="text-lg font-bold text-gold mb-1">{label}:</h2>
      <div className="text-lg font-bold text-white">{score}</div>
    </motion.div>
  );
}
