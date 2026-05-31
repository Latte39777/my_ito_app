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
    // 💡 修正1: 元の p-4 gap-3 を lg(大画面) の基準とし、スマホと md(中画面) では少しスリムに
    <div className="ito-box flex w-full flex-col gap-2 p-3 md:gap-2.5 md:p-3.5 lg:gap-3 lg:p-4">
      {/* 💡 修正2: 見出しの文字サイズと下の余白(pb)を段階的に変化 */}
      <h2 className="border-b border-gray-200 pb-1.5 text-lg font-bold text-black md:pb-2 md:text-xl lg:text-xl">
        参加者
      </h2>

      {/* 💡 修正3: スクロール対応！ maxHeight(max-h) を設定し、溢れたら縦スクロール(overflow-y-auto)させる */}
      <div className="flex max-h-[140px] flex-col gap-1.5 overflow-y-auto pr-1 md:max-h-[180px] lg:max-h-[240px] lg:gap-2">
        {players.map((player) => {
          const isMe = player.id === myPlayerId;

          return (
            <div
              key={player.id}
              className="group flex w-full items-center justify-between gap-1 lg:gap-2"
            >
              <PlayerInfo player={player} isMe={isMe} isSmall={true} />

              {/* 三点リーダーボタン（ホストかつ自分以外に表示） */}
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
