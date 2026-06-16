import { Player, Theme } from "@/types/schema";

/**
 * テーマの title 内にある「【名前】」をランダムなプレイヤー名に置換する。
 * プレイヤーが存在しない場合は「???」にフォールバック。
 */
export const replaceNamePlaceholder = (
  theme: Theme,
  players: Player[],
): Theme => {
  if (!theme.title.includes("【名前】")) return theme;

  const activePlayers = players.filter((p) => !p.isSpectating);
  const randomPlayer =
    activePlayers[Math.floor(Math.random() * activePlayers.length)];

  return {
    ...theme,
    title: theme.title.replaceAll("【名前】", randomPlayer?.name ?? "???"),
  };
};

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
