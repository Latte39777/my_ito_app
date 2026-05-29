import { Player } from "@/types/schema";

// ゲームのロジックの関数群
// カードの山札を作成してシャッフルする
export const createShuffledDeck = (): number[] => {
  // 1から100までの数字の配列を作成 [1, 2, 3, ..., 100]
  const deck = Array.from({ length: 100 }, (_, i) => i + 1);

  // フィッシャー・イェーツのシャッフルアルゴリズムで混ぜる
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // 要素を入れ替える
  }

  return deck;
};

// プレイヤーにカードを配る
export const distributeCards = (
  players: Player[],
  deck: number[],
): { updatedPlayers: Player[]; remainingDeck: number[] } => {
  // 山札のコピーを作成（元のデッキは変更しない）
  const currentDeck = [...deck];

  const updatedPlayers = players.map((player) => {
    // 観戦者（isSpectating = true）にはカードを配らない
    if (player.isSpectating) {
      return { ...player, card: null, answerText: "", isCardOpen: false };
    }

    // 山札の先頭から1枚取り出す
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

// 次のラウンドへ進むためにプレイヤーの状態を一括リセットする
export const resetAllPlayersForNextRound = (
  players: Player[],
  freshDeck: number[],
): { updatedPlayers: Player[]; remainingDeck: number[] } => {
  // 全員を一度初期状態（カードなし、言葉空っぽ、未オープン，観戦者じゃない）に戻す
  const resetPlayers = players.map((player) => ({
    ...player,
    card: null,
    answerText: "",
    isCardOpen: false,
    isSpectating: false,
  }));

  // 新しくシャッフルされた山札から、改めてカードを配り直す
  return distributeCards(resetPlayers, freshDeck);
};
