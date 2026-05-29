import { Theme } from "@/types/schema";
import { updateRoomAtomic } from "./dbUtils";
import {
  createShuffledDeck,
  resetAllPlayersForNextRound,
} from "@/lib/gameLogic";

// Hostによるゲーム進行管理の関数群
// 次のラウンドへ進む
export const advanceToNextRound = async (
  roomCode: string,
  nextTheme: Theme,
) => {
  await updateRoomAtomic(roomCode, (room) => {
    const freshDeck = createShuffledDeck();

    // // 観戦者を解除して全員参加状態にする
    // const playersForNextRound = room.players.map((p) => ({
    //   ...p,
    //   isSpectating: false,
    //   answerText: "",
    //   isCardOpen: false,
    //   card: null,
    // }));

    // 全プレイヤーの状態をリセットして新しいデッキを配る
    // 観戦者を解除して全員参加状態にするはresetAllPlayersForNextRoundの中で行う
    const { updatedPlayers, remainingDeck } = resetAllPlayersForNextRound(
      room.players,
      freshDeck,
    );

    return {
      round_number: (room.round_number || 1) + 1,
      current_theme: nextTheme,
      players: updatedPlayers,
      deck: remainingDeck,
    };
  });
};

// ゲームを終了する
export const endGame = async (roomCode: string) => {
  // 部屋の状態を「waiting」に戻すだけでOK。
  // PlayingRoom側でstatusが変わったのを検知して画面遷移する
  // 部屋から，プレイヤーからゲーム関連のデータを消す必要はない（過去のラウンドの記録として残しておく）
  await updateRoomAtomic(roomCode, () => {
    return { status: "waiting" };
  });
};

// プレイヤーをキックする
export const kickPlayer = async (roomCode: string, targetId: string) => {
  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.filter((p) => p.id !== targetId);
    return { players };
  });
};

// お題を変更する
export const updateTheme = async (roomCode: string, newTheme: Theme) => {
  await updateRoomAtomic(roomCode, () => {
    return { current_theme: newTheme };
  });
};

// ライフを更新する
export const updateRoomLife = async (roomCode: string, newLife: number) => {
  await updateRoomAtomic(roomCode, () => {
    return { life: newLife };
  });
};
