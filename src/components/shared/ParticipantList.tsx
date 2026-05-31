"use client";

import { Player } from "@/types/schema";
import { PlayerInfo } from "@/components/shared/PlayerInfo";

interface ParticipantListProps {
  players: Player[];
  myPlayerId: string;
  isHost?: boolean;
  onKickPlayer?: (id: string) => void;
}

export function ParticipantList({
  players,
  myPlayerId,
  isHost,
  onKickPlayer,
}: ParticipantListProps) {
  const handleKickClick = (player: Player) => {
    if (confirm(`${player.name} をキックしますか？`)) {
      onKickPlayer?.(player.id);
    }
  };

  return (
    <div className="ito-box flex h-full w-full flex-col gap-1.5 p-2 md:h-auto md:gap-2.5 md:p-3.5 lg:gap-3 lg:p-4">
      
      <h2 className="border-b border-gray-200 text-sm font-bold text-black md:pb-1.5 md:text-lg lg:text-xl">
        参加者
      </h2>

      
      
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1 md:max-h-[180px] md:flex-none md:gap-1.5 lg:max-h-[240px] lg:gap-2">
        {players.map((player) => {
          const isMe = player.id === myPlayerId;

          return (
            <div
              key={player.id}
              className="group flex w-full items-center justify-between gap-1 lg:gap-2"
            >
              <PlayerInfo player={player} isMe={isMe} isSmall={true} />

              {isHost && !isMe && (
                <button
                  onClick={() => handleKickClick(player)}
                  className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                  aria-label="キックメニュー"
                >
                  ⋮
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
