import { supabase } from "@/lib/supabase";
import { Room } from "@/types/schema";

export async function updateRoomAtomic(
  roomCode: string,
  updater: (currentData: Room) => Partial<Room>,
) {
  const { data: latestRoom, error: fetchError } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_code", roomCode)
    .single();

  if (fetchError || !latestRoom) {
    throw new Error("部屋データの取得に失敗しました。");
  }

  const updateDataRaw = updater(latestRoom as Room);

  if (Object.keys(updateDataRaw).length === 0) return;

  const { error: updateError } = await supabase
    .from("rooms")
    .update(updateDataRaw)
    .eq("room_code", roomCode);

  if (updateError) {
    throw new Error(`DB更新エラー: ${updateError.message}`);
  }
}
