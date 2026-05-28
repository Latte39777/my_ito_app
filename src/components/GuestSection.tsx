"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface GuestSectionProps {
  userName: string;
  iconId: string;
}

export function GuestSection({ userName, iconId }: GuestSectionProps) {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (!userName.trim()) {
      alert("名前を入力してください！");
      return;
    }
    if (roomCode.length !== 4) {
      alert("部屋コードは4桁で入力してください！");
      return;
    }

    setLoading(true);
    try {
      const code = roomCode.toUpperCase();

      const { data, error } = await supabase
        .from("rooms")
        .select("room_code")
        .eq("room_code", code)
        .single();

      if (error || !data) {
        throw new Error("入力された部屋コードが存在しません！確認してね。");
      }

      router.push(
        `/room/${code}?name=${encodeURIComponent(userName)}&icon=${iconId}`,
      );
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ito-box flex flex-col gap-4 p-5">
      <h2 className="text-xl font-bold text-black m-0">部屋に入る</h2>

      <input
        type="text"
        maxLength={4}
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        placeholder="4桁の部屋コード"
        className="w-full border-none border-b border-gray-300 text-2xl tracking-[4px] py-2 text-black focus:outline-none placeholder-gray-300"
      />

      <button
        onClick={handleJoin}
        disabled={loading || roomCode.length !== 4}
        className="w-full bg-black text-white text-lg font-bold py-3 rounded-lg border-none cursor-pointer disabled:opacity-50 transition-opacity"
      >
        {loading ? "確認中..." : "参加する"}
      </button>
    </section>
  );
}
