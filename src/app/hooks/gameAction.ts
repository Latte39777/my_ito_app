import { endGame } from "@/services/gameService";
import { leaveRoom } from "@/services/playerService";

export const useGameActions = (
  roomCode: string,
  myPlayerId: string,
  isHost: boolean,
) => {
  const quitGame = async () => {
    if (isHost) await endGame(roomCode);
    else await leaveRoom(roomCode, myPlayerId);
  };
  return { quitGame };
};
