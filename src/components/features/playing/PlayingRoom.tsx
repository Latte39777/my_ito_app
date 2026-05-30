"use client";

import { Room, Player } from "@/types/schema";
import { ThemeBox } from "./ThemeBox";
import { LifeBox } from "./LifeBox";
import { MyCardBox } from "./MyCardBox";
import { AnswerInputBox } from "./AnswerInputBox";
import { AnswersBoard } from "./AnswersBoard";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { GameActionButtons } from "./GameActionButtons"; // 💡 さっき作ったやつ！
import { usePlayingRoomActions } from "@/app/hooks/usePlayingRoomActions";

interface PlayingRoomProps {
  room: Room;
  players: Player[];
  myPlayer: Player;
  isHost: boolean;
  onLeaveRoom: () => void;
}

export function PlayingRoom({
  room,
  players,
  myPlayer,
  isHost,
  onLeaveRoom,
}: PlayingRoomProps) {
  const roundNumber = room.round_number || 1;
  const playingPlayers = players.filter((p) => !p.isSpectating);
  const isAllAnswered =
    playingPlayers.length > 0 &&
    playingPlayers.every((p) => p.answerText !== "");

  const actions = usePlayingRoomActions(room, myPlayer, isHost);

  return (
    <div className="flex flex-col w-full max-w-[1500px] mx-auto p-4 md:p-8 gap-1 h-full">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center font-bold text-black mb-4 gap-y-3 relative">
        <h2 className="text-3xl md:text-4xl tracking-wider shrink-0">
          第{roundNumber}回
        </h2>
        {myPlayer.isSpectating && (
          <div className="w-full md:w-auto flex justify-center order-last md:order-none">
            <div className="animate-pulse bg-gray-200 text-gray-600 font-bold px-4 md:px-6 py-2 md:py-3 rounded-full shadow-sm text-xs md:text-sm whitespace-nowrap">
              👀 観戦中：次のラウンドから参加します
            </div>
          </div>
        )}
        <span className="text-lg md:text-xl shrink-0">
          ルームID : {room.room_code}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 左カラム */}
        <div className="flex-1 flex flex-col gap-10">
          <ThemeBox
            theme={room.current_theme}
            isHost={isHost}
            onChangeTheme={actions.handleChangeTheme}
            isProcessing={actions.isProcessing}
            loadingAction={actions.loadingAction}
          />

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
                isProcessing={actions.loadingAction === "submitAnswer"}
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
            isProcessing={actions.isProcessing}
            loadingAction={actions.loadingAction}
          />

          <MyCardBox
            card={myPlayer.card}
            isCardOpen={myPlayer.isCardOpen}
            showOpenButton={isAllAnswered && !myPlayer.isCardOpen}
            isSpectating={myPlayer.isSpectating}
            onOpenCards={actions.handleOpenMyCard}
            loadingAction={actions.loadingAction}
          />

          <ParticipantList
            players={players}
            myPlayerId={myPlayer.id}
            isHost={isHost}
            onKickPlayer={actions.handleKickPlayer}
          />

          <GameActionButtons
            isHost={isHost}
            isProcessing={actions.isProcessing}
            loadingAction={actions.loadingAction}
            onNextRound={actions.handleNextRound}
            onLeaveRoom={onLeaveRoom}
          />
        </div>
      </div>
    </div>
  );
}
