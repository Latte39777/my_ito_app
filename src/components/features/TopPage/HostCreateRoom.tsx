"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/services/roomService";

interface HostSectionProps {
  userName: string;
  iconId: string;
}

export function HostSection({ userName, iconId }: HostSectionProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!userName.trim()) {
      alert("名前を入力してください！");
      return;
    }
    setLoading(true);
    try {
      const defaultTheme = {
        id: "theme-default",
        title: "デートで行きたい場所と言えば？",
        low: "カッコ悪い",
        high: "カッコイイ",
      };

      const { roomCode, hostId } = await createRoom(
        userName,
        iconId,
        defaultTheme,
      );

      router.push(`/room/${roomCode}?hostId=${hostId}`);
    } catch (error: unknown) {
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
      className="ito-btn ito-btn-primary py-4 px-4 disabled:opacity-50"
    >
      {loading ? "部屋を作成中..." : "新しく部屋を作る（ホスト）"}
    </button>
  );
}
