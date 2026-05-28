"use client";

import { useEffect, useState } from "react";
import { Room, Player } from "@/types/schema";
import { ParticipantList } from "./ParticipantList";
import { useRouter } from "next/navigation";

interface WaitingRoomProps {
  room: Room;
  players: Player[];
  myPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
  onDisbandRoom: () => void; // 退出・解散共通のハンドラ
}

export function WaitingRoom({
  room,
  players,
  myPlayerId,
  isHost,
  onStartGame,
  onDisbandRoom,
}: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter(); // 💡 useRouter を追加

  // 💡 ホストが解散したことを検知してホームへ戻す
  useEffect(() => {
    // もしステータスが "waiting" に戻った(解散された)とき、
    // かつ自分がホストではない場合のみホームへ戻る
    if (room.status === "waiting" && !isHost) {
      alert("ホストがルームを解散しました。");
      router.push("/");
    }
  }, [room.status, isHost, router]);

  const handleCopyUrl = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 w-full max-w-[400px] mx-auto pt-10">
      <h1 className="font-kei text-4xl font-black text-black mb-6 tracking-[2px]">
        ナンバートーク
      </h1>

      <h2 className="text-2xl font-bold text-black mb-6">
        ルームID : {room.room_code}
      </h2>

      {/* 参加者リスト */}
      <div className="w-full mb-8">
        <ParticipantList
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost} // ホスト判定を渡す
        />
      </div>

      {/* アクションボタン */}
      <div className="w-full flex flex-col gap-4 mb-8">
        {isHost ? (
          <>
            <button
              onClick={onStartGame}
              className="ito-btn ito-btn-primary py-3 px-4 font-bold"
            >
              始める
            </button>
            <button onClick={onDisbandRoom} className="ito-btn ito-btn-outline">
              解散する
            </button>
          </>
        ) : (
          <>
            <div className="ito-btn bg-gray-300 text-gray-600 border-none cursor-not-allowed text-center">
              ホストの開始を待っています...
            </div>
            <button onClick={onDisbandRoom} className="ito-btn ito-btn-outline">
              退出する
            </button>
          </>
        )}
      </div>

      {/* 招待URL */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 text-center text-sm font-bold text-black overflow-hidden text-ellipsis whitespace-nowrap">
          {typeof window !== "undefined" ? window.location.href : "https://..."}
        </div>

        <button onClick={handleCopyUrl} className="ito-btn ito-btn-dark w-full">
          {copied ? "コピーしました！" : "URLをコピー"}
        </button>
      </div>
    </div>
  );
}
