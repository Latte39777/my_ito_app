"use server";

import { supabase } from "@/lib/supabase";
import { Player, Room, roomSchema } from "@/types/schema";

// プレイヤーのアクション
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

// 自分の回答を提出する
export const submitMyAnswer = async (
  roomCode: string,
  myId: string,
  text: string,
) => {
  // 1. 完全に最新の部屋データを一度DBから直接持ってくる
  const { data: latestRoom, error: fetchError } = await supabase
    .from("rooms")
    .select("players")
    .eq("room_code", roomCode)
    .single();

  if (fetchError || !latestRoom) {
    throw new Error(
      "部屋データの取得に失敗しました。時間をおいて再度お試しください。",
    );
  }

  // 2. 最新のプレイヤーリストに対して、自分の解答だけを上書きする
  const currentPlayers = (latestRoom.players as unknown as Player[]) || [];
  const updatedPlayers = currentPlayers.map((p) =>
    p.id === myId ? { ...p, answerText: text } : p,
  );

  // 3. 安全にDBを更新
  await safeUpdateRoom(roomCode, { players: updatedPlayers });
};

// 自分のカードをオープンする
export const openMyCard = async (roomCode: string, myId: string) => {
  // 1. 最新のデータを取得
  const { data: latestRoom, error: fetchError } = await supabase
    .from("rooms")
    .select("players")
    .eq("room_code", roomCode)
    .single();

  if (fetchError || !latestRoom) {
    throw new Error("部屋データの取得に失敗しました。");
  }

  // 2. 自分のカードだけをオープンに変更
  const currentPlayers = (latestRoom.players as unknown as Player[]) || [];
  const updatedPlayers = currentPlayers.map((p) =>
    p.id === myId ? { ...p, isCardOpen: true } : p,
  );

  await safeUpdateRoom(roomCode, { players: updatedPlayers });
};

// ルームを退出
export const leaveRoom = async (roomCode: string, playerId: string) => {
  // 1. 最新のデータを取得
  const { data: latestRoom, error: fetchError } = await supabase
    .from("rooms")
    .select("players")
    .eq("room_code", roomCode)
    .single();

  if (fetchError || !latestRoom) {
    throw new Error("部屋データの取得に失敗しました。");
  }

  // 2. プレイヤーリストから自分を削除
  const currentPlayers = (latestRoom.players as unknown as Player[]) || [];
  const updatedPlayers = currentPlayers.filter((p) => p.id !== playerId);

  await safeUpdateRoom(roomCode, { players: updatedPlayers });
};

// 部屋に参加する（ゲーム中なら観戦者として参加させる）
export const joinRoom = async (
  roomCode: string,
  playerId: string,
  name: string,
  icon: string,
) => {
  // 1. 最新のルームデータを取得（ステータスも取得！）
  const { data: latestRoom, error: fetchError } = await supabase
    .from("rooms")
    .select("players, status") // status を追加
    .eq("room_code", roomCode)
    .single();

  if (fetchError || !latestRoom) {
    throw new Error("部屋データの取得に失敗しました。");
  }

  // 2. プレイヤーリストと現在のゲーム状態を確認
  const currentPlayers = (latestRoom.players as unknown as Player[]) || [];

  // 💡 ゲーム中("playing")なら観戦者として参加させる
  const isCurrentlyPlaying = latestRoom.status === "playing";

  const newPlayer: Player = {
    id: playerId,
    name,
    icon,
    isHost: false,
    card: null,
    answerText: "",
    isCardOpen: false,
    isOnline: true,
    isSpectating: isCurrentlyPlaying, // ゲーム中なら true になる
  };

  const updatedPlayers = [...currentPlayers, newPlayer];

  await safeUpdateRoom(roomCode, { players: updatedPlayers });
};
