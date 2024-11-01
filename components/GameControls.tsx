'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
}

export default function GameControls({ onHit, onStand }: GameControlsProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={onHit}
          className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 
                   text-white font-bold px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg transform hover:scale-105 
                   transition-all duration-200 text-lg sm:text-xl min-w-[120px] sm:min-w-[160px]"
        >
          Pedir
        </Button>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      >
        <Button
          onClick={onStand}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 
                   text-white font-bold px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg transform hover:scale-105 
                   transition-all duration-200 text-lg sm:text-xl min-w-[120px] sm:min-w-[160px]"
        >
          Quedarse
        </Button>
      </motion.div>
    </div>
  );
}
