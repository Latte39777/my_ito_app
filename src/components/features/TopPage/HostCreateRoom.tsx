"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/services/roomService";
import { THEMES_LIST } from "@/data/themes";

interface HostCreateRoomProps {
  userName: string;
  iconId: string;
}

export function HostCreateRoom({ userName, iconId }: HostCreateRoomProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    const trimmedName = userName.trim();
    if (!trimmedName) {
      alert("名前を入力してください！");
      return;
    }

    const lastCreatedStr = localStorage.getItem("ito_last_created_at");
    if (lastCreatedStr) {
      const lastCreated = parseInt(lastCreatedStr, 10);
      const now = Date.now();
      const cooldownMs = 30 * 1000;

      if (now - lastCreated < cooldownMs) {
        const remainSeconds = Math.ceil(
          (cooldownMs - (now - lastCreated)) / 1000,
        );
        alert(`部屋を作りすぎです！あと ${remainSeconds} 秒待ってください。`);
        return;
      }
    }

    setLoading(true);
    try {
      const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
      const randomTheme = THEMES_LIST[randomIndex];

      const { roomCode, hostId } = await createRoom(
        trimmedName,
        iconId,
        randomTheme,
      );

      localStorage.setItem("ito_last_created_at", Date.now().toString());

      router.push(`/room/${roomCode}?hostId=${hostId}`);
    } catch (error: unknown) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "部屋の作成に失敗しました",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={loading || !userName.trim()}
      className="ito-btn ito-btn-primary flex w-full items-center justify-center gap-2 px-4 py-4 disabled:opacity-50"
    >
      {loading ? "部屋を作成中..." : "新しく部屋を作る（ホスト）"}
    </button>
  );
}
