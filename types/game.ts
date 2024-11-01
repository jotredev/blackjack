export type CardType = {
  suit: string;
  value: string;
  numericValue: number;
};

export type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver';