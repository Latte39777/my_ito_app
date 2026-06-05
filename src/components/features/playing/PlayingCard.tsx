"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PlayingCardProps {
  card: number | null;
  isCardOpen: boolean;
}

const THEMES = [
  {
    ornament: "text-amber-500",
    ornamentOpen: "text-amber-200",
    border: "border-amber-500",
    borderOpen: "border-amber-200",
    text: "text-amber-900",
  },
  {
    ornament: "text-emerald-500",
    ornamentOpen: "text-emerald-200",
    border: "border-emerald-500",
    borderOpen: "border-emerald-200",
    text: "text-emerald-900",
  },
  {
    ornament: "text-blue-500",
    ornamentOpen: "text-blue-200",
    border: "border-blue-500",
    borderOpen: "border-blue-200",
    text: "text-blue-900",
  },
  {
    ornament: "text-purple-500",
    ornamentOpen: "text-purple-200",
    border: "border-purple-500",
    borderOpen: "border-purple-200",
    text: "text-purple-900",
  },
  {
    ornament: "text-rose-500",
    ornamentOpen: "text-rose-200",
    border: "border-rose-500",
    borderOpen: "border-rose-200",
    text: "text-rose-900",
  },
  {
    ornament: "text-cyan-500",
    ornamentOpen: "text-cyan-200",
    border: "border-cyan-500",
    borderOpen: "border-cyan-200",
    text: "text-cyan-900",
  },
];
export function PlayingCard({ card, isCardOpen }: PlayingCardProps) {
  const theme = useMemo(() => {
    if (card === null) return THEMES[0];
    return THEMES[card % THEMES.length];
  }, [card]);

  const cx = 116; 
  const cy = 24; 
  const w = 12; 
  const h = 18; 
  const diamondPoints = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;

  const textColor = isCardOpen ? "text-gray-300" : theme.text;
  const ornamentColor = isCardOpen ? theme.ornamentOpen : theme.ornament;
  const borderClass = isCardOpen
    ? `border-dashed shadow-none ${theme.borderOpen}`
    : `shadow-md ${theme.border}`;

  return (
    <div
      className={cn(
        "relative flex h-32 w-24 select-none items-center justify-center overflow-hidden rounded-xl border-2 bg-white transition-all md:h-44 md:w-32",
        borderClass,
      )}
    >
      
      <svg
        className={cn("absolute top-0 left-0 h-10 w-10 md:h-16 md:w-16", ornamentColor)}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M0,0 L16,0 A16,16 0 0,0 0,16 Z" />
      </svg>

      
      <svg
        className={cn(
          "absolute right-0 bottom-0 h-10 w-10 rotate-180 md:h-16 md:w-16",
          ornamentColor,
        )}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M0,0 L16,0 A16,16 0 0,0 0,16 Z" />
      </svg>

      
      <svg
        className={cn("absolute top-1 left-0 h-6 w-full md:h-8", ornamentColor)}
        viewBox="0 0 128 32"
        fill="currentColor"
        stroke="currentColor"
      >
        <line x1="33" y1="8" x2="48" y2="8" strokeWidth="1.5" />
        <circle cx="56" cy="8" r="2" stroke="none" />
        <circle cx="72" cy="8" r="2" stroke="none" />
        <line x1="80" y1="8" x2="108" y2="8" strokeWidth="1.5" />
        <circle cx="116" cy="8" r="2" stroke="none" />
        <polygon points={diamondPoints} stroke="none" />
      </svg>

      
      <svg
        className={cn(
          "absolute bottom-1 left-0 h-6 w-full rotate-180 md:h-8",
          ornamentColor,
        )}
        viewBox="0 0 128 32"
        fill="currentColor"
        stroke="currentColor"
      >
        <line x1="33" y1="8" x2="48" y2="8" strokeWidth="1.5" />
        <circle cx="56" cy="8" r="2" stroke="none" />
        <circle cx="72" cy="8" r="2" stroke="none" />
        <line x1="80" y1="8" x2="108" y2="8" strokeWidth="1.5" />
        <circle cx="116" cy="8" r="2" stroke="none" />
        <polygon points={diamondPoints} stroke="none" />
      </svg>

      
      <span
        className={cn(
          "font-hana z-10 text-5xl tracking-tighter drop-shadow-sm md:text-6xl",
          textColor,
        )}
      >
        {card !== null ? card : "?"}
      </span>
    </div>
  );
}
