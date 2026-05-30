"use client";

import { Room, Player } from "@/types/schema";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { RoomInfoAndShare } from "./RoomInfoAndShare"; // 💡 パスは環境に合わせてください

interface WaitingRoomProps {
  room: Room;
  players: Player[];
  myPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
  onDisbandRoom: () => void;
  isProcessing?: boolean; // 💡 追加
}

export function WaitingRoom({
  room,
  players,
  myPlayerId,
  isHost,
  onStartGame,
  onDisbandRoom,
  isProcessing = false, // 💡 追加
}: WaitingRoomProps) {
  return (
    <div className="flex-1 flex flex-col items-center p-5 w-full max-w-[400px] mx-auto pt-10">
      <h1 className="font-kei text-4xl font-black text-black mb-6 tracking-[2px]">
        ナンバートーク
      </h1>

      <div className="w-full mb-8 flex flex-col items-center">
        <RoomInfoAndShare roomCode={room.room_code} />
      </div>

      <div className="w-full mb-8">
        <ParticipantList
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost}
        />
      </div>

      <div className="w-full flex flex-col gap-4 mb-8">
        {isHost ? (
          <>
            <button
              onClick={onStartGame}
              disabled={isProcessing}
              className="ito-btn ito-btn-primary py-3 px-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "処理中..." : "始める"}
            </button>
            <button
              onClick={onDisbandRoom}
              disabled={isProcessing}
              className="ito-btn ito-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "処理中..." : "解散する"}
            </button>
          </>
        ) : (
          <>
            <div className="ito-btn bg-gray-300 text-gray-600 border-none cursor-not-allowed text-center">
              ホストの開始を待っています...
            </div>
            <button
              onClick={onDisbandRoom}
              disabled={isProcessing}
              className="ito-btn ito-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "処理中..." : "退出する"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
