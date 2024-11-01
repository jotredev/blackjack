'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CardType } from '@/types/game';

interface PlayingCardProps {
  card: CardType;
  index?: number;
  isDealer?: boolean;
  isHidden?: boolean;
  onAnimationComplete?: () => void;
}

export default function PlayingCard({
  card,
  index = 0,
  isDealer = false,
  isHidden = false,
  onAnimationComplete,
}: PlayingCardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦';

  return (
    <motion.div
      initial={{
        y: isDealer ? -500 : 500,
        rotate: isDealer ? -180 : 180,
        opacity: 0,
      }}
      animate={{
        y: 0,
        rotate: 0,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.3,
        delay: index * 0.1,
        onComplete: onAnimationComplete,
      }}
      className="perspective-1000"
    >
      <div
        className={cn(
          'w-28 h-40 md:w-32 md:h-48 relative transform-style-3d transition-transform duration-300',
          isHidden && 'rotate-y-180'
        )}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-white rounded-xl shadow-xl border-2 border-gray-200">
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center p-2',
                isRed ? 'text-red-600' : 'text-black'
              )}
            >
              <div className="flex items-center gap-0.5 absolute top-2 left-2">
                <span className="text-xl font-bold">{card.value}</span>
                <span className="text-2xl">{card.suit}</span>
              </div>
              <span className="text-6xl">{card.suit}</span>
              <div className="flex items-center gap-0.5 absolute bottom-2 right-2 rotate-180">
                <span className="text-xl font-bold">{card.value}</span>
                <span className="text-2xl">{card.suit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-blue-800 rounded-xl shadow-xl border-2 border-gray-200">
            <div
              className="absolute inset-0 bg-opacity-50 rounded-xl"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #1e40af 0, #1e40af 10px, #1e3a8a 10px, #1e3a8a 20px)',
              }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
