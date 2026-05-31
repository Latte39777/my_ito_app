"use server";

import { supabase } from "@/lib/supabase";
import { roomSchema, Theme } from "@/types/schema";

export const createRoom = async (
  hostName: string,
  iconId: string,
  initialTheme: Theme,
): Promise<{ roomCode: string; hostId: string }> => {
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const hostPlayerId = crypto.randomUUID();

  const hostPlayer = {
    id: hostPlayerId,
    name: hostName,
    icon: iconId,
    isHost: true,
    card: null,
    answerText: "",
    isCardOpen: false,
    isOnline: true,
    isSpectating: false,
  };

  const rawRoomData = {
    room_code: roomCode,
    status: "waiting" as const,
    life: 3,
    current_theme: initialTheme,
    players: [hostPlayer],
    deck: [],
    round_started_at: null,
  };

  const parsed = roomSchema.safeParse(rawRoomData);
  if (!parsed.success) throw new Error("初期データが不正です");

  const { error } = await supabase.from("rooms").insert(parsed.data);
  if (error) throw new Error(`部屋の作成に失敗しました: ${error.message}`);

  return { roomCode, hostId: hostPlayerId };
};
