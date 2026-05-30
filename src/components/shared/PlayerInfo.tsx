"use client";

import { AVAILABLE_ICONS } from "@/data/icon";
import { Player } from "@/types/schema";

interface PlayerInfoProps {
  player: Player;
  isMe?: boolean;
  size?: "sm" | "md"; // 💡 小さいサイズ(参加者リスト)と大きいサイズ(回答欄)を分ける
}

export function PlayerInfo({
  player,
  isMe = false,
  size = "md",
}: PlayerInfoProps) {
  const iconData =
    AVAILABLE_ICONS.find((i) => i.id === player.icon) || AVAILABLE_ICONS[0];
  const IconComponent = iconData.Icon;

  // サイズに応じたスタイルの切り替え
  const isSmall = size === "sm";
  const iconSize = isSmall ? 20 : 30;
  const textSize = isSmall ? "text-lg" : "text-2xl";
  const tagSize = isSmall ? "text-xs" : "text-lg";

  return (
    <div className="flex items-center gap-1 flex-grow truncate">
      <div
        className={`flex items-center justify-center shrink-0 ${isSmall ? "w-[20px] h-[20px]" : "w-[30px] h-[30px]"}`}
      >
        <IconComponent size={iconSize} className={iconData.color} />
      </div>

      <span
        className={`font-bold text-black truncate max-w-[120px] ${textSize}`}
      >
        {player.name}
      </span>

      <div className="flex items-center shrink-0">
        {player.isHost && (
          <span className={`text-yellow-600 font-bold ml-1 ${tagSize}`}>
            👑ホスト
          </span>
        )}
        {isMe && (
          <span className={`text-blue-600 font-bold ml-1 ${tagSize}`}>
            👤あなた
          </span>
        )}
        {player.isSpectating && (
          <span className={`text-gray-500 font-bold ml-1 ${tagSize}`}>
            👀観戦中
          </span>
        )}
      </div>
    </div>
  );
}
