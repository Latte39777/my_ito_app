import { Player } from "@/types/schema";

// ゲームのロジック（山札作成、配札、次のラウンドへのリセットなど）をここにまとめる予定
export const createShuffledDeck = (): number[] => {
  // 1から100までの数字の配列を作成 [1, 2, 3, ..., 100]
  const deck = Array.from({ length: 100 }, (_, i) => i + 1);

  // フィッシャー・イェーツのシャッフルアルゴリズムで完全にバラバラに混ぜる
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // 要素を入れ替える
  }

  return deck;
};

// プレイヤーにカードを配る関数
export const distributeCards = (
  players: Player[],
  deck: number[],
): { updatedPlayers: Player[]; remainingDeck: number[] } => {
  // 元の配列を傷つけないようにコピーを作る
  const currentDeck = [...deck];

  const updatedPlayers = players.map((player) => {
    // 観戦者（isSpectating が true）にはカードを配らない
    if (player.isSpectating) {
      return { ...player, card: null, answerText: "", isCardOpen: false };
    }

    // 山札の先頭から1枚取り出す（popでもよいがshiftで先頭から消費）
    const drawnCard = currentDeck.shift() || null;

    return {
      ...player,
      card: drawnCard,
      answerText: "", // 新しいラウンドなので言葉はリセット
      isCardOpen: false, // もちろん裏向きスタート
    };
  });

  return {
    updatedPlayers,
    remainingDeck: currentDeck, // 残った山札を返す
  };
};

// 次のラウンドへ進むためにプレイヤーの状態を一括リセットする
// (ホストが「次のラウンド」ボタンを押したときに、distributeCardsと組み合わせて使う)
export const resetAllPlayersForNextRound = (
  players: Player[],
  freshDeck: number[],
): { updatedPlayers: Player[]; remainingDeck: number[] } => {
  // 全員を一度初期状態（カードなし、言葉空っぽ、未オープン）に戻す
  const resetPlayers = players.map((player) => ({
    ...player,
    card: null,
    answerText: "",
    isCardOpen: false,
  }));

  // 新しくシャッフルされた山札から、改めてカードを配り直す
  return distributeCards(resetPlayers, freshDeck);
};
