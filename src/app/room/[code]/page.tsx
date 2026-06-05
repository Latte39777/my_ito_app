"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { WaitingRoom } from "@/components/features/waiting/WaitingRoom";
import { PlayingRoom } from "@/components/features/playing/PlayingRoom";
import { SettingsButton } from "@/components/shared/SettingsButton";
import { useRoom } from "@/app/hooks/useRoom";
import { RulesModal } from "@/components/shared/RulesModal";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;

  const {
    room,
    players,
    myPlayerId,
    loading,
    isActionLoading,
    handleStartGame,
    handleQuitRoom,
  } = useRoom(roomCode);

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="flex flex-1 items-center justify-center font-bold text-black">
          読み込み中...
        </div>
      </AnimatedBackground>
    );
  }

  if (!room) return null;

  const myPlayer = players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost || false;

  return (
    <AnimatedBackground>
      <div className="absolute top-2 right-2 z-50 flex items-center gap-2 md:top-4 md:right-4">
        <RulesModal />
        {myPlayer && (
          <SettingsButton
            roomCode={room.room_code}
            myPlayerId={myPlayer.id}
            currentName={myPlayer.name}
          />
        )}
      </div>

      {room.status === "waiting" && (
        <WaitingRoom
          room={room}
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost}
          onStartGame={handleStartGame}
          onDisbandRoom={handleQuitRoom}
          isProcessing={isActionLoading}
        />
      )}

      {room.status === "playing" && myPlayer && (
        <PlayingRoom
          room={room}
          players={players}
          myPlayer={myPlayer}
          isHost={isHost}
          onLeaveRoom={handleQuitRoom}
        />
      )}

      {room.status === "playing" && !myPlayer && (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 font-bold text-black">
          <p>プレイヤー情報が見つかりません。</p>
          <button
            onClick={() => router.push("/")}
            className="ito-btn ito-btn-outline flex w-full items-center justify-center gap-2"
          >
            トップへ戻る
          </button>
        </div>
      )}
    </AnimatedBackground>
  );
}
