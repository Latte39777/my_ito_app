"use client";

import { AVAILABLE_ICONS } from "@/data/icon";
import { Player } from "@/types/schema";

interface ParticipantListProps {
  players: Player[];
  myPlayerId: string;
  isHost?: boolean; // 💡 追加
  onKickPlayer?: (id: string) => void; // 💡 追加
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
          const iconData =
            AVAILABLE_ICONS.find((i) => i.id === player.icon) ||
            AVAILABLE_ICONS[0];
          const IconComponent = iconData.Icon;
          const isMe = player.id === myPlayerId;

          return (
            <div key={player.id} className="flex items-center gap-2 group">
              <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
                <IconComponent size={20} className={iconData.color} />
              </div>

              {/* 名前とタグ部分 */}
              <div className="flex items-center gap-1 flex-grow truncate">
                <span className="font-bold text-black text-lg truncate">
                  {player.name}
                </span>
                <div className="flex items-center shrink-0">
                  {player.isHost && (
                    <span className="text-yellow-600 font-bold ml-1 text-xs">
                      👑ホスト
                    </span>
                  )}
                  {isMe && (
                    <span className="text-blue-600 font-bold ml-1 text-xs">
                      👤あなた
                    </span>
                  )}
                  {player.isSpectating && (
                    <span className="text-gray-500 font-bold ml-1 text-xs">
                      👀観戦中
                    </span>
                  )}
                </div>
              </div>

              {/* 💡 三点リーダーボタン（ホストかつ自分以外に表示） */}
              {isHost && !isMe && (
                <button
                  onClick={() => handleKickClick(player)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500 transition-colors"
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
