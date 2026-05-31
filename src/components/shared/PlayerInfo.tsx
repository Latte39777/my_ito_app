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

  // 💡 修正1: アイコンのベースサイズ(スマホ用)を小さく
  const iconClass = isSmall
    ? "text-[14px] md:text-[18px] lg:text-[20px]"
    : "text-[20px] md:text-[28px] lg:text-[30px]";

  // 💡 修正2: 名前の文字サイズをスマホ用に小さく (text-sm -> text-xs, text-lg -> text-base)
  const textClass = isSmall
    ? "text-xs md:text-base lg:text-lg"
    : "text-base md:text-xl lg:text-2xl";

  // 💡 修正3: タグの文字サイズも極限まで小さく
  const tagClass = isSmall
    ? "text-[10px] md:text-[14px] lg:text-[16px]"
    : "text-[8px] md:text-[10px] lg:text-[11px] leading-none";

  const hideBadgeText = isSmall;

  const badgeWrapperClass = hideBadgeText
    ? "p-0.5 md:p-1.5"
    : "px-1 py-[2px] md:px-1.5 md:py-[3px] lg:px-2";

  const badgeIconClass = hideBadgeText
    ? ""
    : "mr-0.5 text-[8px] md:text-[10px] lg:text-[12px]";

  const badges = (
    <>
      {player.isHost && (
        <div
          title="ホスト"
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors ${badgeWrapperClass}`}
        >
          <span
            className={`font-hana flex items-center font-bold text-yellow-600 ${tagClass}`}
          >
            <TbCrown className={badgeIconClass} />
            {!hideBadgeText && "ホスト"}
          </span>
        </div>
      )}
      {isMe && (
        <div
          title="あなた"
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors ${badgeWrapperClass}`}
        >
          <span
            className={`font-hana flex items-center font-bold text-blue-600 ${tagClass}`}
          >
            <TbUserFilled className={badgeIconClass} />
            {!hideBadgeText && "あなた"}
          </span>
        </div>
      )}
      {player.isSpectating && (
        <div
          title="観戦中"
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors ${badgeWrapperClass}`}
        >
          <span
            className={`font-hana flex items-center font-bold text-gray-500 ${tagClass}`}
          >
            <PiEyesFill className={badgeIconClass} />
            {!hideBadgeText && "観戦中"}
          </span>
        </div>
      )}
    </>
  );

  return (
    // 💡 修正5: 全体のアイコンと文字の隙間(gap)もスマホ時は狭く(gap-1)
    <div className="flex w-full flex-grow items-center gap-1 md:gap-1.5 lg:gap-2">
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
          <div className="ml-auto flex shrink-0 items-center gap-0.5 md:gap-1">
            {badges}
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {(player.isHost || isMe || player.isSpectating || actionButton) && (
            <div className="flex w-full items-center justify-between gap-2 md:mb-1">
              <div className="flex items-center gap-1 md:gap-1.5">{badges}</div>

              {actionButton && (
                <div className="flex shrink-0 items-center">{actionButton}</div>
              )}
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
