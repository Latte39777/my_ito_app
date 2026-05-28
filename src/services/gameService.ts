"use server";

import { supabase } from "@/lib/supabase";
import { Player, Room, roomSchema, Theme } from "@/types/schema";
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
  console.log("=== ゲーム開始前のプレイヤー情報 ===");
  room.players.forEach((p) =>
    console.log(`${p.name}: spectating=${p.isSpectating}`),
  );
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
  // 1. シャッフル済みの山札を作成
  const freshDeck = createShuffledDeck();

  // 2. 観戦者を解除し、カードを配るためにプレイヤーリストを整理
  // 観戦者も参加者として扱い、全員にカードを配る前提のリストを作る
  const playersForNextRound = room.players.map((p) => ({
    ...p,
    isSpectating: false, // 全員参加状態にする
    answerText: "",
    isCardOpen: false,
    card: null, // 一旦リセット
  }));

  // 3. resetAllPlayersForNextRound を使ってカードを配る
  // ※この関数内で山札からカードを player.card に代入しているはずです
  const { updatedPlayers, remainingDeck } = resetAllPlayersForNextRound(
    playersForNextRound,
    freshDeck,
  );

  const nextRound = (room.round_number || 1) + 1;

  // 4. 更新
  await safeUpdateRoom(room.room_code, {
    round_number: nextRound,
    current_theme: nextTheme,
    players: updatedPlayers, // ここには既に全員分のカードが入っているはず
    deck: remainingDeck,
  });
};

// ゲームを終了する（ホストが操作）
export const endGame = async (roomCode: string) => {
  // 部屋のデータを削除
  const { error } = await supabase
    .from("rooms")
    .update({ status: "waiting" })
    .eq("room_code", roomCode);

  if (error) throw new Error(`ゲーム終了に失敗しました: ${error.message}`);
};

// hostのキック機能
export const kickPlayer = async (roomCode: string, playerId: string) => {
  // 1. 最新の部屋データを取得
  const { data: latestRoom, error: fetchError } = await supabase
    .from("rooms")
    .select("players")
    .eq("room_code", roomCode)
    .single();

  if (fetchError || !latestRoom) {
    throw new Error("部屋データの取得に失敗しました。");
  }

  // 2. プレイヤーリストからキック対象を除外
  const currentPlayers = (latestRoom.players as unknown as Player[]) || [];
  const updatedPlayers = currentPlayers.filter((p) => p.id !== playerId);

  const { error } = await supabase
    .from("rooms")
    .update({ players: updatedPlayers })
    .eq("room_code", roomCode);

  if (error)
    throw new Error(`プレイヤーのキックに失敗しました: ${error.message}`);
};
