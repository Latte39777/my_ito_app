"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { WaitingRoom } from "@/components/features/waiting/WaitingRoom";
import { PlayingRoom } from "@/components/features/playing/PlayingRoom";
import { endGame, startGame } from "@/services/gameService";
import { leaveRoom } from "@/services/playerService";
import { useRoom } from "@/app/hooks/useRoom";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;

  const { room, players, myPlayerId, loading } = useRoom(roomCode);

  const handleStartGame = async () => {
    if (!room) return;
    try {
      await startGame(room.room_code);
    } catch (error) {
      console.error(error);
      alert("ゲームの開始に失敗しました。");
    }
  };

  const handleQuitRoom = async () => {
    if (!room) return;
    const isHost = players.find((p) => p.id === myPlayerId)?.isHost;

    if (
      !confirm(isHost ? "ルームを解散しますか？" : "ルームから退出しますか？")
    )
      return;

    try {
      if (isHost) {
        await endGame(room.room_code);
      } else {
        await leaveRoom(room.room_code, myPlayerId);
      }
      localStorage.removeItem(`ito_player_${roomCode}`);
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("退出に失敗しました");
    }
  };

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
      {room.status === "waiting" && (
        <WaitingRoom
          room={room}
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost}
          onStartGame={handleStartGame}
          onDisbandRoom={handleQuitRoom}
        />
      )}

      {room.status === "playing" && myPlayer && (
        <PlayingRoom
          room={room}
          players={players}
          myPlayer={myPlayer}
          isHost={isHost}
        />
      )}

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
