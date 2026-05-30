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
    <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col gap-1 p-4 md:p-8">
      <div className="font-hana relative mb-4 flex flex-wrap items-center justify-between gap-y-3 font-bold text-black md:flex-nowrap">
        <h2 className="shrink-0 text-3xl tracking-wider md:text-4xl">
          第{roundNumber}回
        </h2>
        {myPlayer.isSpectating && (
          <div className="order-last flex w-full justify-center md:order-none md:w-auto">
            <div className="animate-pulse rounded-full bg-gray-200 px-4 py-2 text-xs font-bold whitespace-nowrap text-gray-600 shadow-sm md:px-6 md:py-3 md:text-sm">
              👀 観戦中：次のラウンドから参加します
            </div>
          </div>
        )}
        <span className="shrink-0 text-lg md:text-xl">
          ルームID : {room.room_code}
        </span>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* 左カラム */}
        <div className="flex flex-1 flex-col gap-10">
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
        <div className="flex w-full shrink-0 flex-col gap-8 md:w-[280px]">
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
