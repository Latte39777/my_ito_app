"use server";

import { supabase } from "@/lib/supabase";
import { roomSchema, Theme } from "@/types/schema";

export const createRoom = async (
  hostName: string,
  iconId: string,
  initialTheme: Theme,
): Promise<string> => {
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

  // ホストプレイヤーの初期データを作成
  const hostPlayer = {
    id: crypto.randomUUID(),
    name: hostName,
    icon: iconId, // スキーマに合わせてiconを追加
    isHost: true,
    card: null,
    answerText: "",
    isCardOpen: false,
    isOnline: true,
    isSpectating: false,
  };

  // 部屋の初期データを作成
  const rawRoomData = {
    room_code: roomCode,
    status: "waiting" as const,
    life: 3,
    current_theme: initialTheme,
    players: [hostPlayer],
    deck: [],
    round_started_at: null,
  };

  // Zodでデータのバリデーションを行う
  const parsed = roomSchema.safeParse(rawRoomData);
  if (!parsed.success) throw new Error("初期データが不正です");

  // Supabaseに部屋のデータを保存
  const { error } = await supabase.from("rooms").insert(parsed.data);
  if (error) throw new Error(`部屋の作成に失敗しました: ${error.message}`);

  return roomCode;
};
