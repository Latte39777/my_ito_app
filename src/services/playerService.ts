import { Player, playerSchema } from "@/types/schema";
import { updateRoomAtomic } from "./dbUtils";

export const submitMyAnswer = async (
  roomCode: string,
  myId: string,
  text: string,
) => {
  const parsedPlayerId = playerSchema.shape.id.parse(myId);
  const parsedAnswerText = playerSchema.shape.answerText.parse(text);

  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.map((p) =>
      p.id === parsedPlayerId ? { ...p, answerText: parsedAnswerText } : p,
    );
    return { players };
  });
};

export const openMyCard = async (roomCode: string, myId: string) => {
  const parsedPlayerId = playerSchema.shape.id.parse(myId);

  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.map((p) =>
      p.id === parsedPlayerId ? { ...p, isCardOpen: true } : p,
    );
    return { players };
  });
};

export const leaveRoom = async (roomCode: string, playerId: string) => {
  const parsedPlayerId = playerSchema.shape.id.parse(playerId);

  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.filter((p) => p.id !== parsedPlayerId);
    return { players };
  });
};

export const joinRoom = async (
  roomCode: string,
  playerId: string,
  name: string,
  icon: string,
) => {
  await updateRoomAtomic(roomCode, (room) => {
    if (room.players.some((p) => p.id === playerId)) return {};

    const isCurrentlyPlaying = room.status === "playing";
    const newPlayer: Player = playerSchema.parse({
      id: playerId,
      name,
      icon,
      isHost: false,
      card: null,
      answerText: "",
      isCardOpen: false,
      isOnline: true,
      isSpectating: isCurrentlyPlaying,
    });

    return { players: [...room.players, newPlayer] };
  });
};

export const changePlayerName = async (
  roomCode: string,
  playerId: string,
  newName: string,
) => {
  const parsedPlayerId = playerSchema.shape.id.parse(playerId);
  const parsedName = playerSchema.shape.name.parse(newName);

  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.map((p) =>
      p.id === parsedPlayerId ? { ...p, name: parsedName } : p,
    );
    return { players };
  });
};
