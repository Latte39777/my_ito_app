"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { WaitingRoom } from "@/components/features/waiting/WaitingRoom";
import { PlayingRoom } from "@/components/features/playing/PlayingRoom";
import { SettingsButton } from "@/components/shared/SettingsButton";
import { useRoom } from "@/app/hooks/useRoom"; // 💡 パスは環境に合わせてください

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;

  // 💡 全てをフックから受け取る
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
        <div className="flex-1 flex items-center justify-center font-bold text-black">
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
      {/* ⚙️ 設定ボタン */}
      {myPlayer && (
        <SettingsButton
          roomCode={room.room_code}
          myPlayerId={myPlayer.id}
          currentName={myPlayer.name}
        />
      )}

      {/* 待機室 */}
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

      {/* プレイ画面 */}
      {room.status === "playing" && myPlayer && (
        <PlayingRoom
          room={room}
          players={players}
          myPlayer={myPlayer}
          isHost={isHost}
          onLeaveRoom={handleQuitRoom}
        />
      )}

      {/* プレイヤー情報が見つからない場合のエラー画面 */}
      {room.status === "playing" && !myPlayer && (
        <div className="flex-1 flex flex-col items-center justify-center font-bold text-black gap-4 h-full">
          <p>プレイヤー情報が見つかりません。</p>
          <button
            onClick={() => router.push("/")}
            className="ito-btn ito-btn-outline"
          >
            トップへ戻る
          </button>
        </div>
      )}
    </AnimatedBackground>
  );
}
