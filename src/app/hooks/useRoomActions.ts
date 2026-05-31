import { useState } from "react";
import { useRouter } from "next/navigation";
import { endGame, startGame } from "@/services/gameService";
import { leaveRoom } from "@/services/playerService";
import { Room, Player } from "@/types/schema";

export function useRoomActions(
  roomCode: string,
  room: Room | null,
  players: Player[],
  myPlayerId: string,
) {
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleStartGame = async () => {
    if (!room || isActionLoading) return;
    setIsActionLoading(true);
    try {
      await startGame(room.room_code);
    } catch (error) {
      console.error(error);
      alert("ゲームの開始に失敗しました。");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleQuitRoom = async () => {
    if (!room || isActionLoading) return;
    const isHost = players.find((p) => p.id === myPlayerId)?.isHost;

    setIsActionLoading(true);
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
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    isActionLoading,
    handleStartGame,
    handleQuitRoom,
  };
}
