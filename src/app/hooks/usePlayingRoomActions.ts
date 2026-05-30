import { useRouter } from "next/navigation";
import { Theme, Room, Player } from "@/types/schema";
import { THEMES_LIST } from "@/data/themes";
import {
  advanceToNextRound,
  updateTheme,
  endGame,
  kickPlayer,
  updateRoomLife,
} from "@/services/gameService";
import {
  leaveRoom,
  openMyCard,
  submitMyAnswer,
} from "@/services/playerService";

export function usePlayingRoomActions(
  room: Room,
  myPlayer: Player,
  isHost: boolean,
) {
  const router = useRouter();

  const handleChangeTheme = async (newTheme: Theme) => {
    try {
      await updateTheme(room.room_code, newTheme);
    } catch (error) {
      alert("お題の変更に失敗しました");
    }
  };

  const handleChangeLife = async (newLife: number) => {
    try {
      await updateRoomLife(room.room_code, newLife);
    } catch (error) {
      alert("ライフの更新に失敗しました");
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    try {
      await submitMyAnswer(room.room_code, myPlayer.id, answer);
    } catch (error) {
      alert("回答の送信に失敗しました");
    }
  };

  const handleEditAnswer = async (currentText: string) => {
    try {
      const newAnswer = prompt("回答を編集してください", currentText);
      if (!newAnswer || newAnswer.trim() === "" || newAnswer === currentText)
        return;
      await submitMyAnswer(room.room_code, myPlayer.id, newAnswer.trim());
    } catch (error) {
      alert("回答の更新に失敗しました");
    }
  };

  const handleOpenMyCard = async () => {
    try {
      await openMyCard(room.room_code, myPlayer.id);
    } catch (error) {
      alert("カードの公開に失敗しました");
    }
  };

  const handleLeaveRoom = async () => {
    const confirmMessage = isHost
      ? "ルームを解散しますか？全員退出します。"
      : "ルームから退出しますか？";
    if (!confirm(confirmMessage)) return;

    try {
      if (isHost) await endGame(room.room_code);
      else await leaveRoom(room.room_code, myPlayer.id);
      router.push("/");
    } catch (error) {
      alert("ルームからの退出に失敗しました");
    }
  };

  const handleNextRound = async () => {
    if (
      !confirm("次のラウンドに進みますか？全員の数字と回答がリセットされます。")
    )
      return;
    try {
      const nextTheme =
        THEMES_LIST[Math.floor(Math.random() * THEMES_LIST.length)];
      await advanceToNextRound(room.room_code, nextTheme);
    } catch (error) {
      alert("次のラウンドへの移行に失敗しました");
    }
  };

  const handleKickPlayer = async (targetId: string) => {
    try {
      await kickPlayer(room.room_code, targetId);
    } catch (error) {
      alert("キックに失敗しました");
    }
  };

  // UI側で使いたい関数だけを返す
  return {
    handleChangeTheme,
    handleChangeLife,
    handleSubmitAnswer,
    handleEditAnswer,
    handleOpenMyCard,
    handleLeaveRoom,
    handleNextRound,
    handleKickPlayer,
  };
}
