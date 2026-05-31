import { useState } from "react";
import { Theme, Room, Player } from "@/types/schema";
import { THEMES_LIST } from "@/data/themes";
import {
  advanceToNextRound,
  updateTheme,
  kickPlayer,
  updateRoomLife,
} from "@/services/gameService";
import { openMyCard, submitMyAnswer } from "@/services/playerService";

export function usePlayingRoomActions(
  room: Room,
  myPlayer: Player,
  isHost: boolean,
) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const isProcessing = loadingAction !== null;

  const handleChangeTheme = async (newTheme: Theme) => {
    if (isProcessing) return;
    setLoadingAction("theme");
    try {
      await updateTheme(room.room_code, newTheme);
    } catch (error) {
      console.error(error);
      alert("お題の変更に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChangeLife = async (newLife: number) => {
    if (isProcessing) return;
    setLoadingAction("life");
    try {
      await updateRoomLife(room.room_code, newLife);
    } catch (error) {
      console.error(error);
      alert("ライフの更新に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (isProcessing) return;
    setLoadingAction("submitAnswer");
    try {
      await submitMyAnswer(room.room_code, myPlayer.id, answer);
    } catch (error) {
      console.error(error);
      alert("回答の送信に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEditAnswer = async (newAnswer: string) => {
    if (!newAnswer || newAnswer.trim() === "") return;

    if (isProcessing) return;
    setLoadingAction("editAnswer");
    try {
      await submitMyAnswer(room.room_code, myPlayer.id, newAnswer.trim());
    } catch (error) {
      console.error(error);
      alert("回答の更新に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenMyCard = async () => {
    if (isProcessing) return;
    setLoadingAction("openCard");
    try {
      await openMyCard(room.room_code, myPlayer.id);
    } catch (error) {
      console.error(error);
      alert("カードの公開に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleNextRound = async () => {
    if (isProcessing) return;
    setLoadingAction("nextRound");
    try {
      const nextTheme =
        THEMES_LIST[Math.floor(Math.random() * THEMES_LIST.length)];
      await advanceToNextRound(room.room_code, nextTheme);
    } catch (error) {
      console.error(error);
      alert("次のラウンドへの移行に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleKickPlayer = async (targetId: string) => {
    if (isProcessing) return;
    setLoadingAction("kick");
    try {
      await kickPlayer(room.room_code, targetId);
    } catch (error) {
      console.error(error);
      alert("キックに失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    isProcessing,
    loadingAction,
    handleChangeTheme,
    handleChangeLife,
    handleSubmitAnswer,
    handleEditAnswer,
    handleOpenMyCard,
    handleNextRound,
    handleKickPlayer,
  };
}
