"use client";

import { Room, Player } from "@/types/schema";
import { ThemeBox } from "./ThemeBox";
import { LifeBox } from "./LifeBox";
import { MyCardBox } from "./MyCardBox";
import { AnswerInputBox } from "./AnswerInputBox";
import { AnswersBoard } from "./AnswersBoard";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { usePlayingRoomActions } from "@/app/hooks/usePlayingRoomActions";

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

  // フックを呼び出して、必要な関数群を一気に受け取る！
  const actions = usePlayingRoomActions(room, myPlayer, isHost);

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
            onChangeTheme={actions.handleChangeTheme}
          />

          {myPlayer.isSpectating && (
            <div className="w-full flex justify-center mb-4">
              <div className="animate-pulse bg-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full shadow-sm text-sm">
                👀 観戦中：次のラウンドから参加します
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {myPlayer.answerText || myPlayer.isSpectating ? (
              <AnswersBoard
                players={players}
                myPlayerId={myPlayer.id}
                onEditAnswer={actions.handleEditAnswer}
              />
            ) : (
              <AnswerInputBox
                player={myPlayer}
                onSubmitAnswer={actions.handleSubmitAnswer}
              />
            )}
          </div>
        </div>

        {/* 右カラム */}
        <div className="w-full md:w-[280px] flex flex-col gap-8 shrink-0">
          <LifeBox
            life={room.life}
            isHost={isHost}
            onChangeLife={actions.handleChangeLife}
          />

          <MyCardBox
            card={myPlayer.card}
            isCardOpen={myPlayer.isCardOpen}
            showOpenButton={isAllAnswered && !myPlayer.isCardOpen}
            isSpectating={myPlayer.isSpectating}
            onOpenCards={actions.handleOpenMyCard}
          />

          <ParticipantList
            players={players}
            myPlayerId={myPlayer.id}
            isHost={isHost}
            onKickPlayer={actions.handleKickPlayer}
          />

          <div className="flex flex-col gap-3">
            {isHost && (
              <button
                className="ito-btn ito-btn-primary w-full py-3"
                onClick={actions.handleNextRound}
              >
                つぎのお題
              </button>
            )}
            <button
              className="ito-btn ito-btn-outline w-full mt-2"
              onClick={actions.handleLeaveRoom}
            >
              やめる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
