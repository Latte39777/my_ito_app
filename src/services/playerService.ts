import { Player, playerSchema } from "@/types/schema";
import { updateRoomAtomic } from "./dbUtils";

// プレイヤーが行うアクションの関数群
// 自分の回答を提出する
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

// 自分のカードをオープンする
export const openMyCard = async (roomCode: string, myId: string) => {
  const parsedPlayerId = playerSchema.shape.id.parse(myId);

  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.map((p) =>
      p.id === parsedPlayerId ? { ...p, isCardOpen: true } : p,
    );
    return { players };
  });
};

// ルームを退出する
export const leaveRoom = async (roomCode: string, playerId: string) => {
  const parsedPlayerId = playerSchema.shape.id.parse(playerId);

  await updateRoomAtomic(roomCode, (room) => {
    // filter を使って、自分（playerId）以外のプレイヤーだけを残す
    const players = room.players.filter((p) => p.id !== parsedPlayerId);
    return { players };
  });
};

// ルームに参加する
export const joinRoom = async (
  roomCode: string,
  playerId: string,
  name: string,
  icon: string,
) => {
  await updateRoomAtomic(roomCode, (room) => {
    // 既に参加済みなら何もしない
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

// 名前を変更する
export const changePlayerName = async (
  roomCode: string,
  playerId: string,
  newName: string,
) => {
  const parsedPlayerId = playerSchema.shape.id.parse(playerId);
  const parsedName = playerSchema.shape.name.parse(newName);

  await updateRoomAtomic(roomCode, (room) => {
    // filter を使って、自分（playerId）以外のプレイヤーだけを残す
    const players = room.players.map((p) =>
      p.id === parsedPlayerId ? { ...p, name: parsedName } : p,
    );
    return { players };
  });
};
