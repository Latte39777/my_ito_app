import { useRoomSync } from "./useRoomSync";
import { useRoomActions } from "./useRoomActions";

export function useRoom(roomCode: string) {
  const sync = useRoomSync(roomCode);
  const actions = useRoomActions(
    roomCode,
    sync.room,
    sync.players,
    sync.myPlayerId,
  );

  return {
    ...sync,
    ...actions,
  };
}
