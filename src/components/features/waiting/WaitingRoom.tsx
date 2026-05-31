"use client";

import { Room, Player } from "@/types/schema";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { RoomInfoAndShare } from "./RoomInfoAndShare";
import { ConfirmButton } from "@/components/shared/ConfirmButton";

interface WaitingRoomProps {
  room: Room;
  players: Player[];
  myPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
  onDisbandRoom: () => void;
  isProcessing?: boolean;
}

export function WaitingRoom({
  room,
  players,
  myPlayerId,
  isHost,
  onStartGame,
  onDisbandRoom,
  isProcessing = false,
}: WaitingRoomProps) {
  return (
    <div className="ito-narrow-container pt-10">
      <h1 className="font-kei mb-6 text-4xl font-black tracking-[2px] text-black">
        ナンバートーク
      </h1>

      <div className="mb-8 flex w-full flex-col items-center">
        <RoomInfoAndShare roomCode={room.room_code} />
      </div>

      <div className="mb-8 w-full">
        <ParticipantList
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost}
        />
      </div>

      <div className="mb-8 flex w-full flex-col gap-4">
        {isHost ? (
          <>
            {/* 💡 始めるボタン */}
            <ConfirmButton
              onConfirm={onStartGame}
              defaultText={isProcessing ? "処理中..." : "始める"}
              confirmText="ゲームを始める？"
              baseClassName="ito-btn ito-btn-primary py-3 px-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              confirmClassName="!bg-blue-700" // ポジティブなので濃い青
              disabled={isProcessing}
            />
            {/* 💡 解散するボタン */}
            <ConfirmButton
              onConfirm={onDisbandRoom}
              defaultText={isProcessing ? "処理中..." : "解散する"}
              confirmText="本当に解散する？"
              baseClassName="ito-btn ito-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              confirmClassName="!bg-red-500 !text-white !border-black" // 黒枠＋赤背景
              disabled={isProcessing}
            />
          </>
        ) : (
          <>
            <div className="ito-btn cursor-not-allowed border-none bg-gray-300 text-center text-gray-600">
              ホストの開始を待っています...
            </div>
            {/* 💡 退出するボタン */}
            <ConfirmButton
              onConfirm={onDisbandRoom}
              defaultText={isProcessing ? "処理中..." : "退出する"}
              confirmText="本当に退出する？"
              baseClassName="ito-btn ito-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              confirmClassName="!bg-red-500 !text-white !border-black" // 黒枠＋赤背景
              disabled={isProcessing}
            />
          </>
        )}
      </div>
    </div>
  );
}
