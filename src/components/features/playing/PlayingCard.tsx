"use client";

import { useMemo } from "react";

interface PlayingCardProps {
  card: number | null;
  isCardOpen: boolean;
}

const THEMES = [
  {
    // 0: アンティークゴールド
    ornament: "text-amber-500",
    ornamentOpen: "text-amber-200",
    border: "border-amber-500",
    borderOpen: "border-amber-200",
  },
  {
    // 1: ミントグリーン
    ornament: "text-emerald-500",
    ornamentOpen: "text-emerald-200",
    border: "border-emerald-500",
    borderOpen: "border-emerald-200",
  },
  {
    // 2: スタンダードブルー
    ornament: "text-blue-500",
    ornamentOpen: "text-blue-200",
    border: "border-blue-500",
    borderOpen: "border-blue-200",
  },
  {
    // 3: ミステリアスパープル
    ornament: "text-purple-500",
    ornamentOpen: "text-purple-200",
    border: "border-purple-500",
    borderOpen: "border-purple-200",
  },
  {
    // 4: パッションローズ（赤ピンク）
    ornament: "text-rose-500",
    ornamentOpen: "text-rose-200",
    border: "border-rose-500",
    borderOpen: "border-rose-200",
  },
  {
    // 5: アクアサイアン（水色）
    ornament: "text-cyan-500",
    ornamentOpen: "text-cyan-200",
    border: "border-cyan-500",
    borderOpen: "border-cyan-200",
  },
];

export function PlayingCard({ card, isCardOpen }: PlayingCardProps) {
  const theme = useMemo(() => {
    if (card === null) return THEMES[0];
    const index = card % THEMES.length;
    return THEMES[index];
  }, [card]);

  const textColor = isCardOpen ? "text-gray-300" : "text-black";
  const ornamentColor = isCardOpen ? theme.ornamentOpen : theme.ornament;
  const borderClass = isCardOpen
    ? `border-dashed shadow-none ${theme.borderOpen}`
    : `shadow-md ${theme.border}`;

  return (
    <div
      className={`relative flex h-44 w-32 items-center justify-center overflow-hidden rounded-xl border-2 bg-white select-none ${borderClass} `}
    >
      {/* 🌟 1. 左上の角装飾 */}
      <svg
        className={`absolute top-0 left-0 h-16 w-16 ${ornamentColor}`}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M0,0 L16,0 A16,16 0 0,0 0,16 Z" />
      </svg>

      {/* 🌟 2. 右下の角装飾 */}
      <svg
        className={`absolute right-0 bottom-0 h-16 w-16 ${ornamentColor} rotate-180`}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M0,0 L16,0 A16,16 0 0,0 0,16 Z" />
      </svg>

      {/* 🌟 3. 上部の飾り罫 */}
      <svg
        className={`absolute top-1 left-0 h-8 w-full ${ornamentColor}`}
        viewBox="0 0 128 32"
        fill="currentColor"
        stroke="currentColor"
      >
        <line x1="33" y1="8" x2="48" y2="8" strokeWidth="1.5" />
        <circle cx="56" cy="8" r="2" stroke="none" />
        <circle cx="72" cy="8" r="2" stroke="none" />
        <line x1="80" y1="8" x2="108" y2="8" strokeWidth="1.5" />
        <circle cx="116" cy="8" r="2" stroke="none" />
        <polygon points="116,14 119,19 116,24 113,19" stroke="none" />
      </svg>

      {/* 🌟 4. 下部の飾り罫 */}
      <svg
        className={`absolute bottom-1 left-0 h-8 w-full ${ornamentColor} rotate-180`}
        viewBox="0 0 128 32"
        fill="currentColor"
        stroke="currentColor"
      >
        <line x1="33" y1="8" x2="48" y2="8" strokeWidth="1.5" />
        <circle cx="56" cy="8" r="2" stroke="none" />
        <circle cx="72" cy="8" r="2" stroke="none" />
        <line x1="80" y1="8" x2="108" y2="8" strokeWidth="1.5" />
        <circle cx="116" cy="8" r="2" stroke="none" />
        <polygon points="116,14 119,19 116,24 113,19" stroke="none" />
      </svg>

      {/* 中央の大きな数字 */}
      <span className={`font-hana z-10 text-6xl tracking-tighter ${textColor}`}>
        {card !== null ? card : "?"}
      </span>
    </div>
  );
}
