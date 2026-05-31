"use client";

import { AVAILABLE_ICONS } from "@/data/icon";
import { Player } from "@/types/schema";
import { TbCrown, TbUserFilled } from "react-icons/tb";
import { PiEyesFill } from "react-icons/pi";

interface PlayerInfoProps {
  player: Player;
  isMe?: boolean;
  isSmall?: boolean;
  actionButton?: React.ReactNode;
}

export function PlayerInfo({
  player,
  isMe = false,
  isSmall = false,
  actionButton,
}: PlayerInfoProps) {
  const iconData =
    AVAILABLE_ICONS.find((i) => i.id === player.icon) || AVAILABLE_ICONS[0];
  const IconComponent = iconData.Icon;

  const iconClass = isSmall
    ? "text-[16px] md:text-[18px] lg:text-[20px]"
    : "text-[24px] md:text-[28px] lg:text-[30px]";

  const textClass = isSmall
    ? "text-sm md:text-base lg:text-lg"
    : "text-lg md:text-xl lg:text-2xl";

  const tagClass = isSmall
    ? "text-[12px] md:text-[14px] lg:text-[16px]"
    : "text-[9px] md:text-[10px] lg:text-[11px] leading-none";

  const hideBadgeText = isSmall;

  const badges = (
    <>
      {player.isHost && (
        <div
          title="ホスト"
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors ${hideBadgeText ? "p-1.5" : "px-1.5 py-[3px] lg:px-2"}`}
        >
          <span
            className={`font-hana flex items-center font-bold text-yellow-600 ${tagClass}`}
          >
            <TbCrown
              className={
                hideBadgeText ? "" : "mr-0.5 text-[10px] lg:text-[12px]"
              }
            />
            {!hideBadgeText && "ホスト"}
          </span>
        </div>
      )}
      {isMe && (
        <div
          title="あなた"
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors ${hideBadgeText ? "p-1.5" : "px-1.5 py-[3px] lg:px-2"}`}
        >
          <span
            className={`font-hana flex items-center font-bold text-blue-600 ${tagClass}`}
          >
            <TbUserFilled
              className={
                hideBadgeText ? "" : "mr-0.5 text-[10px] lg:text-[12px]"
              }
            />
            {!hideBadgeText && "あなた"}
          </span>
        </div>
      )}
      {player.isSpectating && (
        <div
          title="観戦中"
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors ${hideBadgeText ? "p-1.5" : "px-1.5 py-[3px] lg:px-2"}`}
        >
          <span
            className={`font-hana flex items-center font-bold text-gray-500 ${tagClass}`}
          >
            <PiEyesFill
              className={
                hideBadgeText ? "" : "mr-0.5 text-[10px] lg:text-[12px]"
              }
            />
            {!hideBadgeText && "観戦中"}
          </span>
        </div>
      )}
    </>
  );

  return (
    <div className="flex w-full flex-grow items-center gap-1.5 lg:gap-2">
      <div
        className={`flex shrink-0 items-center justify-center ${iconClass} ${iconData.color}`}
      >
        <IconComponent />
      </div>

      {isSmall ? (
        <>
          <span
            className={`font-hana min-w-0 flex-1 truncate font-bold text-black ${textClass}`}
          >
            {player.name}
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {badges}
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {(player.isHost || isMe || player.isSpectating || actionButton) && (
            <div className="-mb-0.5 flex w-full items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">{badges}</div>
              {actionButton && <div className="shrink-0">{actionButton}</div>}
            </div>
          )}
          <span
            className={`font-hana min-w-0 truncate leading-tight font-bold text-black ${textClass}`}
          >
            {player.name}
          </span>
        </div>
      )}
    </div>
  );
}
