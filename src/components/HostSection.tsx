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

      // 変更: createRoom に iconId を渡す
      const newRoomCode = await createRoom(userName, iconId, defaultTheme);

      router.push(`/room/${newRoomCode}`);
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
      disabled={loading}
      style={{
        width: "100%",
        backgroundColor: "#4D77FF",
        color: "#FFF",
        fontSize: "18px",
        fontWeight: "bold",
        padding: "16px",
        borderRadius: "12px",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.1s ease",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {loading ? "部屋を作成中..." : "新しく部屋を作る（ホスト）"}
    </button>
  );
}
