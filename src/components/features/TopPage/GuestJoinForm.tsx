"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface GuestJoinFormProps {
  userName: string;
  iconId: string;
}

export function GuestJoinForm({ userName, iconId }: GuestJoinFormProps) {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    const trimmedName = userName.trim();
    if (!trimmedName) {
      alert("名前を入力してください！");
      return;
    }
    const trimmedCode = roomCode.trim().toUpperCase();
    if (trimmedCode.length !== 4) {
      alert("部屋コードは4桁で入力してください！");
      return;
    }

    setLoading(true);
    try {
      const code = trimmedCode;

      const { data, error } = await supabase
        .from("rooms")
        .select("room_code")
        .eq("room_code", code)
        .single();

      if (error || !data) {
        throw new Error("入力された部屋コードが存在しません！確認してね。");
      }

      router.push(
        `/room/${code}?name=${encodeURIComponent(trimmedName)}&icon=${iconId}`,
      );
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ito-box flex flex-col gap-4 p-5">
      <h2 className="m-0 text-xl font-bold text-black">部屋に入る</h2>

      <input
        type="text"
        maxLength={4}
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        placeholder="4桁の部屋コード"
        className="ito-input text-2xl"
      />

      <button
        onClick={handleJoin}
        disabled={loading || roomCode.length !== 4}
        className="ito-btn ito-btn-dark cursor-pointer py-3 font-bold transition-opacity disabled:opacity-50"
      >
        {loading ? "確認中..." : "参加する"}
      </button>
    </section>
  );
}
