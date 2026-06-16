"use client";

import { Room, Player } from "@/types/schema";
import { ThemeBox } from "./ThemeBox";
import { LifeBox } from "./LifeBox";
import { MyCardBox } from "./MyCardBox";
import { AnswerInputBox } from "./AnswerInputBox";
import { AnswersBoard } from "./AnswersBoard";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { GameActionButtons } from "./GameActionButtons";
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
    <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col gap-1 p-4 md:p-4">
      <div className="font-hana relative flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pr-19 font-bold text-black md:mb-2 md:pr-26">
        <h2 className="shrink-0 text-2xl tracking-wider md:text-4xl">
          第{roundNumber}回
        </h2>
        {myPlayer.isSpectating && (
          <div className="order-last flex w-full justify-center md:order-none md:w-auto">
            <div className="animate-pulse rounded-full bg-gray-200 px-4 py-2 text-xs font-bold whitespace-nowrap text-gray-600 shadow-sm md:px-6 md:py-3 md:text-sm">
              👀 観戦中：次のラウンドから参加します
            </div>
          </div>
        )}
        <span className="shrink-0 text-sm md:text-xl">
          ルームID : {room.room_code}
        </span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-10">
          <div className="order-1 md:order-none">
            <ThemeBox
              theme={room.current_theme}
              players={players}
              isHost={isHost}
              onChangeTheme={actions.handleChangeTheme}
              isProcessing={actions.isProcessing}
              loadingAction={actions.loadingAction}
            />
          </div>

          <div className="order-3 -mt-5 flex justify-center md:order-none md:mt-0">
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

        <div className="contents md:flex md:w-[220px] md:shrink-0 md:flex-col md:gap-8 lg:w-[280px]">
          <div className="order-2 mt-1 grid h-[190px] grid-cols-2 grid-rows-[auto_1fr] gap-2 md:order-none md:flex md:h-auto md:flex-col md:gap-4 lg:gap-6">
            <div className="row-span-2 h-full md:order-2 md:h-auto">
              <MyCardBox
                card={myPlayer.card}
                isCardOpen={myPlayer.isCardOpen}
                showOpenButton={isAllAnswered && !myPlayer.isCardOpen}
                isSpectating={myPlayer.isSpectating}
                onOpenCards={actions.handleOpenMyCard}
                loadingAction={actions.loadingAction}
              />
            </div>

            <div className="md:order-1">
              <LifeBox
                life={room.life}
                isHost={isHost}
                onChangeLife={actions.handleChangeLife}
                isProcessing={actions.isProcessing}
                loadingAction={actions.loadingAction}
              />
            </div>

            <div className="h-full min-h-0 md:order-3 md:h-auto">
              <ParticipantList
                players={players}
                myPlayerId={myPlayer.id}
                isHost={isHost}
                onKickPlayer={actions.handleKickPlayer}
              />
            </div>
          </div>

          <div className="order-4 md:order-none">
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
    </div>
  );
}
