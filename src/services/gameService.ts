"use server";

import { supabase } from "@/lib/supabase";
import { Room, roomSchema, Theme } from "@/types/schema";
import {
  createShuffledDeck,
  distributeCards,
  resetAllPlayersForNextRound,
} from "@/lib/gameLogic";

// 部屋作成, ゲーム開始, ライフ更新など、ゲーム全体に関わるロジックをここにまとめる
// データの安全性をZodで検証してからSupabaseを更新する内部関数
async function safeUpdateRoom(roomCode: string, rawData: Partial<Room>) {
  const result = roomSchema.partial().safeParse(rawData);
  if (!result.success) {
    console.error("バリデーションエラー:", result.error.issues);
    console.error(
      "❌ Zodバリデーションエラーの全貌:",
      JSON.stringify(result.error.format(), null, 2),
    );
    console.error(
      "👉 送信しようとした生データ:",
      JSON.stringify(rawData, null, 2),
    );
    throw new Error("送信しようとしたデータの形式が正しくありません");
  }

  const { error } = await supabase
    .from("rooms")
    .update(result.data)
    .eq("room_code", roomCode);

  if (error) throw new Error(`DB更新エラー: ${error.message}`);
}

// ゲームを開始する（待機室でホストが操作）
export const startGame = async (room: Room) => {
  // ゲーム開始前の部屋データを受け取って、山札を作り、プレイヤーにカードを配るロジック
  const initialDeck = createShuffledDeck();
  // プレイヤー全員にカードを配り、残りの山札も受け取る
  const { updatedPlayers, remainingDeck } = distributeCards(
    room.players,
    initialDeck,
  );

  // 部屋のステータスを「playing」にして、山札とプレイヤーデータを更新
  await safeUpdateRoom(room.room_code, {
    status: "playing", // ステータスを「playing」に変更
    deck: remainingDeck, // 更新された山札データに更新
    players: updatedPlayers, // カードが配られたプレイヤーデータに更新
    round_started_at: Date.now(), // ラウンド開始時刻を記録
  });
};

// ライフを上下させる（ホストが操作）
export const updateRoomLife = async (roomCode: string, nextLife: number) => {
  const safeLife = Math.max(-99, Math.min(99, nextLife));
  await safeUpdateRoom(roomCode, { life: safeLife });
};

// 手札や山札はそのまま、お題だけを安全に変更する（ホストが操作）
export const changeOnlyTheme = async (room: Room, nextTheme: Theme) => {
  await safeUpdateRoom(room.room_code, {
    ...room, // ライフや山札、プレイヤーデータを完全に維持
    current_theme: nextTheme, // お題だけを上書き
  });
};

// 次のゲーム（ラウンド）へ進む（ホストが操作）
export const advanceToNextRound = async (room: Room, nextTheme: Theme) => {
  const freshDeck = createShuffledDeck();
  const { updatedPlayers, remainingDeck } = resetAllPlayersForNextRound(
    room.players,
    freshDeck,
  );

  await safeUpdateRoom(room.room_code, {
    ...room, // 既存のステータスを壊さないように全乗せ
    current_theme: nextTheme,
    players: updatedPlayers,
    deck: remainingDeck,
  });
};
