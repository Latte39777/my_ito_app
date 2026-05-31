import { Theme, roomSchema, themeSchema } from "@/types/schema";
import { updateRoomAtomic } from "./dbUtils";
import {
  createShuffledDeck,
  resetAllPlayersForNextRound,
} from "@/lib/gameLogic";
import { supabase } from "@/lib/supabase";

export const advanceToNextRound = async (
  roomCode: string,
  nextTheme: Theme,
) => {
  const parsedTheme = themeSchema.parse(nextTheme);

  await updateRoomAtomic(roomCode, (room) => {
    const freshDeck = createShuffledDeck();
    const { updatedPlayers, remainingDeck } = resetAllPlayersForNextRound(
      room.players,
      freshDeck,
    );

    const parsedPlayers = roomSchema.shape.players.parse(updatedPlayers);
    const parsedDeck = roomSchema.shape.deck.parse(remainingDeck);
    const parsedRoundNumber = roomSchema.shape.round_number.parse(
      (room.round_number || 1) + 1,
    );

    return {
      round_number: parsedRoundNumber,
      current_theme: parsedTheme,
      players: parsedPlayers,
      deck: parsedDeck,
    };
  });
};

export const startGame = async (roomCode: string) => {
  await updateRoomAtomic(roomCode, (room) => {
    const freshDeck = createShuffledDeck();
    const { updatedPlayers, remainingDeck } = resetAllPlayersForNextRound(
      room.players,
      freshDeck,
    );

    const parsedPlayers = roomSchema.shape.players.parse(updatedPlayers);
    const parsedDeck = roomSchema.shape.deck.parse(remainingDeck);
    const parsedRoundNumber = roomSchema.shape.round_number.parse(1);

    return {
      status: "playing",
      round_number: parsedRoundNumber,
      players: parsedPlayers,
      deck: parsedDeck,
    };
  });
};

export const endGame = async (roomCode: string) => {
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("room_code", roomCode);

  if (error) {
    throw new Error(
      `ゲームの終了（部屋の削除）に失敗しました: ${error.message}`,
    );
  }
};

export const kickPlayer = async (roomCode: string, targetId: string) => {
  await updateRoomAtomic(roomCode, (room) => {
    const players = room.players.filter((p) => p.id !== targetId);
    return { players };
  });
};

export const updateTheme = async (roomCode: string, newTheme: Theme) => {
  const parsedTheme = themeSchema.parse(newTheme);

  await updateRoomAtomic(roomCode, () => {
    return { current_theme: parsedTheme };
  });
};

export const updateRoomLife = async (roomCode: string, newLife: number) => {
  const parsedLife = roomSchema.shape.life.parse(newLife);

  await updateRoomAtomic(roomCode, () => {
    return { life: parsedLife };
  });
};
