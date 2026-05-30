"use client";

import { AVAILABLE_ICONS } from "@/data/icon";
import { Player } from "@/types/schema";
import { TbCrown, TbUserFilled } from "react-icons/tb";
import { PiEyesFill } from "react-icons/pi";

interface PlayerInfoProps {
  player: Player;
  isMe?: boolean;
  size?: "sm" | "md";
}

export function PlayerInfo({
  player,
  isMe = false,
  size = "md",
}: PlayerInfoProps) {
  const iconData =
    AVAILABLE_ICONS.find((i) => i.id === player.icon) || AVAILABLE_ICONS[0];
  const IconComponent = iconData.Icon;

  const isSmall = size === "sm";
  const iconSize = isSmall ? 20 : 30;
  const textSize = isSmall ? "text-lg" : "text-xl";
  const tagSize = isSmall ? "text-xs" : "text-md";

  return (
    <div className="flex w-full flex-grow items-center gap-1">
      <div
        className={`flex shrink-0 items-center justify-center ${isSmall ? "h-[20px] w-[20px]" : "h-[30px] w-[30px]"}`}
      >
        <IconComponent size={iconSize} className={iconData.color} />
      </div>

      <span
        className={`font-hana min-w-0 flex-1 truncate font-bold text-black ${textSize}`}
      >
        {player.name}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {player.isHost && (
          // 💡 アイコンと文字を綺麗に並べるために flex items-center を追加
          <span
            className={`font-hana flex items-center font-bold text-yellow-600 ${tagSize}`}
          >
            <TbCrown className="mr-0.5" /> ホスト
          </span>
        )}
        {isMe && (
          <span
            className={`font-hana flex items-center font-bold text-blue-600 ${tagSize}`}
          >
            <TbUserFilled className="mr-0.5" /> あなた
          </span>
        )}
        {player.isSpectating && (
          <span
            className={`font-hana flex items-center font-bold text-gray-500 ${tagSize}`}
          >
            <PiEyesFill className="mr-0.5" /> 観戦中
          </span>
        )}
      </div>
    </div>
  );
}
