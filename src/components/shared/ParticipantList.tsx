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
    <div className="ito-box w-full p-4 flex flex-col gap-3">
      <h2 className="text-xl font-bold text-black border-b border-gray-200 pb-2">
        参加者
      </h2>

      <div className="flex flex-col gap-2">
        {players.map((player) => {
          const isMe = player.id === myPlayerId;

          return (
            <div
              key={player.id}
              className="flex items-center justify-between gap-2 group w-full"
            >
              <PlayerInfo player={player} isMe={isMe} size="sm" />

              {/* 三点リーダーボタン（ホストかつ自分以外に表示） */}
              {isHost && !isMe && (
                <button
                  onClick={() => handleKickClick(player)}
                  className="p-1 shrink-0 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500 transition-colors"
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
