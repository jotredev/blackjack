'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Coins, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import GameTable from '@/components/GameTable';
import PlayingCard from '@/components/PlayingCard';
import BettingControls from '@/components/BettingControls';
import GameControls from '@/components/GameControls';
import ScoreDisplay from '@/components/ScoreDisplay';
import { CardType, GameState } from '@/types/game';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function BlackjackGame() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [isDealing, setIsDealing] = useState(false);
  const [showDealerHiddenCard, setShowDealerHiddenCard] = useState(false);
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [balanceKey, setBalanceKey] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [lastCardAnimationComplete, setLastCardAnimationComplete] = useState(false);
  const [cardsDealt, setCardsDealt] = useState(false);

  const createDeck = () => {
    const newDeck: CardType[] = [];
    SUITS.forEach((suit) => {
      VALUES.forEach((value) => {
        const numericValue = value === 'A' ? 11 : ['J', 'Q', 'K'].includes(value) ? 10 : parseInt(value);
        newDeck.push({ suit, value, numericValue });
      });
    });
    return shuffle(newDeck);
  };

  const shuffle = (array: CardType[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const calculateHandValue = (hand: CardType[]) => {
    let value = 0;
    let aces = 0;

    hand.forEach((card) => {
      if (card.value === 'A') {
        aces += 1;
      }
      value += card.numericValue;
    });

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  const isNaturalBlackjack = (hand: CardType[]) => {
    if (hand.length !== 2) return false;
    const hasAce = hand.some((card) => card.value === 'A');
    const hasTenCard = hand.some((card) => ['10', 'J', 'Q', 'K'].includes(card.value));
    return hasAce && hasTenCard;
  };

  const updateBalanceWithAnimation = (newBalance: number) => {
    setBalanceKey((prev) => prev + 1);
    setBalance(newBalance);
  };

  const handleBlackjack = () => {
    const isDealerBlackjack = isNaturalBlackjack(dealerHand);

    setTimeout(() => {
      setShowDealerHiddenCard(true);
      setTimeout(() => {
        setShowScores(true);
        setTimeout(() => {
          if (!isDealerBlackjack) {
            const newBalance = balance + Math.floor(currentBet * 2.5);
            updateBalanceWithAnimation(newBalance);
            toast.success('¡Blackjack! ¡Ganaste 2.5x tu apuesta! 🎉');
          } else {
            const newBalance = balance + currentBet;
            updateBalanceWithAnimation(newBalance);
            toast.info('¡Empate! Ambos tienen Blackjack.');
          }
          setGameState('gameOver');
        }, 500);
      }, 1000);
    }, 1000);
  };

  const placeBet = (amount: number) => {
    if (balance >= amount) {
      setCurrentBet(currentBet + amount);
      setBalance(balance - amount);
    } else {
      toast.error('¡Fondos insuficientes!');
    }
  };

  const dealCards = () => {
    if (currentBet === 0) {
      toast.error('¡Por favor, haz una apuesta primero!');
      return;
    }
    setShowScores(false);
    setCardsDealt(false);
    setIsDealing(true);
    const newDeck = [...deck];
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState('playing');

    setTimeout(() => {
      setCardsDealt(true);
      if (isNaturalBlackjack(playerCards)) {
        setIsBlackjack(true);
        setShowScores(true);
        handleBlackjack();
      } else {
        setShowScores(true);
      }
    }, 1000);
  };

  const hit = () => {
    if (isDealing) return;
    setIsDealing(true);
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const handValue = calculateHandValue(newHand);
    if (handValue > 21) {
      setTimeout(() => {
        setShowDealerHiddenCard(true);
        setTimeout(() => {
          toast.error('¡Te has pasado! 😢');
          setGameState('gameOver');
        }, 1000);
      }, 1000);
    } else {
      setIsDealing(false);
    }
  };

  const stand = () => {
    setShowDealerHiddenCard(true);
    setTimeout(() => {
      setGameState('dealerTurn');
    }, 1000);
  };

  const dealerPlay = async () => {
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    const drawCard = () => {
      return new Promise<void>((resolve) => {
        if (calculateHandValue(currentDealerHand) < 17) {
          setIsDealing(true);
          const newCard = currentDeck.pop()!;
          currentDealerHand = [...currentDealerHand, newCard];
          setDealerHand(currentDealerHand);
          setDeck(currentDeck);
          
          setTimeout(() => {
            setIsDealing(false);
            setTimeout(() => {
              resolve();
            }, 800); // Pause between cards
          }, 1000); // Card animation duration
        } else {
          resolve();
        }
      });
    };

    const dealerTurn = async () => {
      while (calculateHandValue(currentDealerHand) < 17) {
        await drawCard();
      }

      const dealerValue = calculateHandValue(currentDealerHand);
      const playerValue = calculateHandValue(playerHand);

      setTimeout(() => {
        if (dealerValue > 21) {
          const newBalance = balance + currentBet * 2;
          updateBalanceWithAnimation(newBalance);
          toast.success('¡El dealer se pasó! ¡Ganaste! 🎉');
        } else if (dealerValue > playerValue) {
          toast.error('¡El dealer gana! 😢');
        } else if (dealerValue < playerValue) {
          const newBalance = balance + currentBet * 2;
          updateBalanceWithAnimation(newBalance);
          toast.success('¡Ganaste! 🎉');
        } else {
          const newBalance = balance + currentBet;
          updateBalanceWithAnimation(newBalance);
          toast.info('¡Empate!');
        }
        setGameState('gameOver');
      }, 1000);
    };

    dealerTurn();
  };

  const resetGame = () => {
    setDeck(createDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setCurrentBet(0);
    setShowDealerHiddenCard(false);
    setIsBlackjack(false);
    setIsDealing(false);
    setShowScores(false);
    setCardsDealt(false);
  };

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  useEffect(() => {
    if (gameState === 'dealerTurn') {
      dealerPlay();
    }
  }, [gameState]);

  return (
    <GameTable>
      <div className="flex flex-col justify-between h-screen py-4">
        <div className="absolute top-4 left-4 z-20">
          <motion.div
            key={balanceKey}
            className="flex items-center gap-2 bg-black/80 p-4 rounded-lg backdrop-blur-sm"
            initial={{ scale: 1 }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 0.5 }}
          >
            <Coins className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">${balance}</span>
          </motion.div>
        </div>

        <div className="absolute top-4 right-4 z-20">
          {currentBet > 0 && (
            <div className="flex items-center gap-2 bg-black/80 p-4 rounded-lg backdrop-blur-sm">
              <span className="text-2xl font-bold text-green-400">Apuesta: ${currentBet}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-6xl">
            {/* Dealer section */}
            <div className="mt-24">
              <div className="relative">
                {showScores && cardsDealt && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="absolute -top-20 w-full flex justify-center z-10"
                  >
                    <ScoreDisplay
                      label="Dealer"
                      score={calculateHandValue(
                        showDealerHiddenCard ? dealerHand : dealerHand.slice(0, 1)
                      )}
                    />
                  </motion.div>
                )}

                <div className="flex flex-wrap justify-center gap-4 mt-38">
                  {dealerHand.map((card, index) => (
                    <PlayingCard
                      key={index}
                      card={card}
                      index={index}
                      isDealer={true}
                      isHidden={index === 1 && !showDealerHiddenCard}
                      onAnimationComplete={() => {
                        if (index === dealerHand.length - 1) {
                          setIsDealing(false);
                          setLastCardAnimationComplete(true);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Player section */}
            <div className="mt-32 mb-32">
              <div className="relative">
                {showScores && cardsDealt && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="absolute -top-20 w-full flex justify-center z-10"
                  >
                    <ScoreDisplay
                      label="Tus puntos"
                      score={calculateHandValue(playerHand)}
                      isBlackjack={isBlackjack}
                    />
                  </motion.div>
                )}

                <div className="flex flex-wrap justify-center gap-4 mt-38">
                  {playerHand.map((card, index) => (
                    <PlayingCard
                      key={index}
                      card={card}
                      index={index}
                      onAnimationComplete={() => {
                        if (index === playerHand.length - 1) {
                          setIsDealing(false);
                          setLastCardAnimationComplete(true);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls section */}
        <div className="w-full flex justify-center items-center pb-8">
          {gameState === 'betting' && (
            <BettingControls
              onBet={placeBet}
              onDeal={dealCards}
              currentBet={currentBet}
              balance={balance}
            />
          )}
          {gameState === 'playing' && !isDealing && calculateHandValue(playerHand) <= 21 && (
            <div className="fixed bottom-12 right-6">
              <GameControls onHit={hit} onStand={stand} />
            </div>
          )}
          {gameState === 'gameOver' && (
            <Button
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 
                       text-white font-bold px-12 py-8 rounded-xl shadow-lg transform hover:scale-105 
                       transition-all duration-200 text-2xl min-w-[300px] flex items-center justify-center gap-3"
              onClick={resetGame}
            >
              <RefreshCw className="w-8 h-8" />
              Jugar de Nuevo
            </Button>
          )}
        </div>
      </div>
    </GameTable>
  );
}