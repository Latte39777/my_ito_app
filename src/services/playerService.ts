import { Player } from "@/types/schema";
import { updateRoomAtomic } from "./dbUtils";

// プレイヤーが行うアクションの関数群
// 自分の回答を提出する
export const submitMyAnswer = async (
  roomCode: string,
  myId: string,
  text: string,
) => {
  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.map((p) =>
      p.id === myId ? { ...p, answerText: text } : p,
    );
    return { players };
  });
};

// 自分のカードをオープンする
export const openMyCard = async (roomCode: string, myId: string) => {
  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.map((p) =>
      p.id === myId ? { ...p, isCardOpen: true } : p,
    );
    return { players };
  });
};

// ルームを退出する
export const leaveRoom = async (roomCode: string, playerId: string) => {
  await updateRoomAtomic(roomCode, (room) => {
    // filter を使って、自分（playerId）以外のプレイヤーだけを残す
    const players = room.players.filter((p) => p.id !== playerId);
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
    const newPlayer: Player = {
      id: playerId,
      name,
      icon,
      isHost: false,
      card: null,
      answerText: "",
      isCardOpen: false,
      isOnline: true,
      isSpectating: isCurrentlyPlaying,
    };

    return { players: [...room.players, newPlayer] };
  });
};

// 名前を変更する
export const changePlayerName = async (
  roomCode: string,
  playerId: string,
  newName: string,
) => {
  await updateRoomAtomic(roomCode, (room) => {
    // filter を使って、自分（playerId）以外のプレイヤーだけを残す
    const players = room.players.map((p) =>
      p.id === playerId ? { ...p, name: newName } : p,
    );
    return { players };
  });
};
