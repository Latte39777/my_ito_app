"use client";

import { Room, Player, Theme } from "@/types/schema";
import { ThemeBox } from "@/components/playing/ThemeBox";
import { LifeBox } from "@/components/playing/LifeBox";
import { MyCardBox } from "./playing/MyCardBox";
import { ParticipantList } from "@/components/ParticipantList";
import { AnswerInputBox } from "@/components/playing/AnswerInputBox";
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
import { AnswerBaord } from "./playing/AnswersBoard";
import { THEMES_LIST } from "@/data/themes";
import { useRouter } from "next/navigation";

interface PlayingRoomProps {
  room: Room;
  players: Player[];
  myPlayer: Player;
  isHost: boolean;
}

export function PlayingRoom({
  room,
  players,
  myPlayer,
  isHost,
}: PlayingRoomProps) {
  const roundNumber = room.round_number || 1;

  const playingPlayers = players.filter((p) => !p.isSpectating);
  const isAllAnswered =
    playingPlayers.length > 0 &&
    playingPlayers.every((p) => p.answerText !== "");

  const router = useRouter();

  const handleChangeTheme = async (newTheme: Theme) => {
    try {
      await updateTheme(room.room_code, newTheme);
    } catch (error) {
      console.error(error);
      alert("お題の変更に失敗しました");
    }
  };

  const handleChangeLife = async (newLife: number) => {
    try {
      await updateRoomLife(room.room_code, newLife);
    } catch (error) {
      console.error(error);
      alert("ライフの更新に失敗しました");
    }
  };

  // 回答提出の処理（AnswerInputBox に渡す）
  const handleSubmitAnswer = async (answer: string) => {
    try {
      await submitMyAnswer(room.room_code, myPlayer.id, answer);
    } catch (error) {
      console.error(error);
      alert("回答の送信に失敗しました");
    }
  };

  const handleEditAnswer = async (currentText: string) => {
    try {
      const newAnswer = prompt("回答を編集してください", currentText);
      if (
        newAnswer === null ||
        newAnswer.trim() === "" ||
        newAnswer === currentText
      ) {
        return;
      }
      await submitMyAnswer(room.room_code, myPlayer.id, newAnswer.trim());
    } catch (error) {
      console.error(error);
      alert("回答の更新に失敗しました");
    }
  };

  // カード公開の処理（MyCardBox に渡す）
  const handleOpenMyCard = async () => {
    try {
      await openMyCard(room.room_code, myPlayer.id);
    } catch (error) {
      console.error(error);
      alert("カードの公開に失敗しました");
    }
  };

  const handleLeaveRoom = async () => {
    const confirmMessage = isHost
      ? "ルームを解散しますか？全員退出します。"
      : "ルームから退出しますか？";
    if (!confirm(confirmMessage)) return;

    try {
      if (isHost) {
        await endGame(room.room_code);
      } else {
        await leaveRoom(room.room_code, myPlayer.id);
      }

      // 💡 重要：ここでホーム画面に飛ばす！
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("ルームからの退出に失敗しました");
    }
  };

  const handleNextRound = async () => {
    // 1. 確認画面
    if (
      !confirm("次のラウンドに進みますか？全員の数字と回答がリセットされます。")
    ) {
      return;
    }

    try {
      // 2. 新しいお題をランダムに選ぶ
      const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
      const nextTheme = THEMES_LIST[randomIndex];

      // 3. サーバー側の関数に「新しいお題」を渡して実行
      // ※ advanceToNextRound(room, theme) の引数構成に合わせる
      await advanceToNextRound(room.room_code, nextTheme);
    } catch (error) {
      console.error(error);
      alert("次のラウンドへの移行に失敗しました");
    }
  };

  const handleKickPlayer = async (targetId: string) => {
    try {
      await kickPlayer(room.room_code, targetId);
    } catch (error) {
      console.error(error);
      alert("キックに失敗しました");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1500px] mx-auto p-4 md:p-8 gap-1 h-full">
      <div className="flex justify-between items-end font-bold text-black mb-2">
        <h2 className="text-3xl md:text-4xl tracking-wider">
          第{roundNumber}回
        </h2>
        <span className="text-lg md:text-xl">ルームID : {room.room_code}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 左カラム */}
        <div className="flex-1 flex flex-col gap-10">
          <ThemeBox
            theme={room.current_theme}
            isHost={isHost}
            onChangeTheme={handleChangeTheme}
          />

          {myPlayer.isSpectating && (
            <div className="w-full flex justify-center mb-4">
              <div className="animate-pulse bg-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full shadow-sm text-sm">
                👀 観戦中：次のラウンドから参加します
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {/* 観戦者はanswerBoardを表示 */}
            {myPlayer.answerText || myPlayer.isSpectating ? (
              <AnswerBaord
                players={players}
                myPlayerId={myPlayer.id}
                onEditAnswer={handleEditAnswer}
              />
            ) : (
              <AnswerInputBox
                player={myPlayer}
                onSubmitAnswer={handleSubmitAnswer}
              />
            )}
          </div>
        </div>

        {/* 右カラム */}
        <div className="w-full md:w-[280px] flex flex-col gap-8 shrink-0">
          {/* 🌟 修正：抜け落ちていた onChangeLife を追加！ */}
          <LifeBox
            life={room.life}
            isHost={isHost}
            onChangeLife={handleChangeLife}
          />

          <MyCardBox
            card={myPlayer.card}
            isCardOpen={myPlayer.isCardOpen}
            // カードを開くボタンは「全員が回答済みかつ自分のカードがまだ開いていないとき」にだけ表示されるように条件を追加
            showOpenButton={isAllAnswered && !myPlayer.isCardOpen}
            isSpectating={myPlayer.isSpectating}
            onOpenCards={handleOpenMyCard}
          />

          <ParticipantList
            players={players}
            myPlayerId={myPlayer.id}
            isHost={isHost}
            onKickPlayer={handleKickPlayer}
          />

          <div className="flex flex-col gap-3">
            {isHost && (
              <button
                className="ito-btn ito-btn-primary w-full py-3"
                onClick={handleNextRound}
              >
                つぎのお題
              </button>
            )}
            <button
              className="ito-btn ito-btn-outline w-full mt-2"
              onClick={handleLeaveRoom}
            >
              やめる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
