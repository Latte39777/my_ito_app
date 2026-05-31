import { Player } from "@/types/schema";

export const createShuffledDeck = (): number[] => {
  const deck = Array.from({ length: 100 }, (_, i) => i + 1);

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; 
  }

  return deck;
};

export const distributeCards = (
  players: Player[],
  deck: number[],
): { updatedPlayers: Player[]; remainingDeck: number[] } => {
  const currentDeck = [...deck];

  const updatedPlayers = players.map((player) => {
    if (player.isSpectating) {
      return { ...player, card: null, answerText: "", isCardOpen: false };
    }

    const drawnCard = currentDeck.shift() || null;

    return {
      ...player,
      card: drawnCard,
      answerText: "",
      isCardOpen: false,
    };
  });

  return {
    updatedPlayers: updatedPlayers,
    remainingDeck: currentDeck,
  };
};

export const resetAllPlayersForNextRound = (
  players: Player[],
  freshDeck: number[],
): { updatedPlayers: Player[]; remainingDeck: number[] } => {
  const resetPlayers = players.map((player) => ({
    ...player,
    card: null,
    answerText: "",
    isCardOpen: false,
    isSpectating: false,
  }));

  return distributeCards(resetPlayers, freshDeck);
};
