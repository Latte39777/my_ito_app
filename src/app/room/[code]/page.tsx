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
  console.log("--- デバッグ情報 ---");
  console.log("myPlayerId (Local):", myPlayerId);
  console.log("players (DB):", players);
  console.log("myPlayer (Found):", myPlayer);

  const isHost = myPlayer?.isHost || false;

  return (
    <AnimatedBackground>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* ルールモーダル */}
        <RulesModal />
        {myPlayer && (
          // 設定ボタンはプレイヤー情報がある場合にのみ表示
          <SettingsButton
            roomCode={room.room_code}
            myPlayerId={myPlayer.id}
            currentName={myPlayer.name}
          />
        )}
      </div>

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
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 font-bold text-black">
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
