"use client";

import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface BettingControlsProps {
  onBet: (amount: number) => void;
  onDeal: () => void;
  currentBet: number;
  balance: number;
}

export default function BettingControls({
  onBet,
  onDeal,
  currentBet,
  balance
}: BettingControlsProps) {
  const chips = [
    { amount: 1000, color: 'from-indigo-400 to-indigo-600', textColor: 'text-white', label: '1K' },
    { amount: 500, color: 'from-purple-400 to-purple-600', textColor: 'text-white', label: '500' },
    { amount: 200, color: 'from-orange-400 to-orange-600', textColor: 'text-white', label: '200' },
    { amount: 100, color: 'from-red-400 to-red-600', textColor: 'text-white', label: '100' },
    { amount: 50, color: 'from-yellow-400 to-yellow-600', textColor: 'text-white', label: '50' },
    { amount: 25, color: 'from-green-400 to-green-600', textColor: 'text-white', label: '25' },
    { amount: 10, color: 'from-blue-400 to-blue-600', textColor: 'text-white', label: '10' }
  ].reverse();

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {chips.map((chip, index) => (
          <motion.div
            key={chip.amount}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => onBet(chip.amount)}
              disabled={balance < chip.amount}
              className={cn(
                "chip w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer",
                "bg-gradient-to-b shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                chip.color
              )}
            >
              <div className="text-center font-bold text-white">
                <div className="text-lg sm:text-2xl">${chip.amount}</div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      
      {currentBet > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={onDeal}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 
                     text-white font-bold px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg transform hover:scale-105 
                     transition-all duration-200 text-lg sm:text-xl min-w-[120px] sm:min-w-[160px]"
          >
            Repartir
          </Button>
        </motion.div>
      )}
    </div>
  );
}