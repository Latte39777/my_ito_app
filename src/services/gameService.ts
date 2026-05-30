import { Theme } from "@/types/schema";
import { updateRoomAtomic } from "./dbUtils";
import {
  createShuffledDeck,
  resetAllPlayersForNextRound,
} from "@/lib/gameLogic";
import { supabase } from "@/lib/supabase";

// Hostによるゲーム進行管理の関数群
// 次のラウンドへ進む
export const advanceToNextRound = async (
  roomCode: string,
  nextTheme: Theme,
) => {
  await updateRoomAtomic(roomCode, (room) => {
    const freshDeck = createShuffledDeck();
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

// ゲームを開始する
export const startGame = async (roomCode: string) => {
  await updateRoomAtomic(roomCode, (room) => {
    const freshDeck = createShuffledDeck();
    const { updatedPlayers, remainingDeck } = resetAllPlayersForNextRound(
      room.players,
      freshDeck,
    );

    return {
      status: "playing",
      round_number: 1,
      players: updatedPlayers,
      deck: remainingDeck,
    };
  });
};

// ゲームを終了する
export const endGame = async (roomCode: string) => {
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("room_code", roomCode);

  if (error) {
    throw new Error(
      `ゲームの終了（部屋の削除）に失敗しました: ${error.message}`,
    );
  }
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
