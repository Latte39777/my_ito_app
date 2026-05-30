"use client";

import { PlayingCard } from "./PlayingCard";

interface MyCardBoxProps {
  card: number | null;
  isCardOpen: boolean;
  showOpenButton: boolean;
  isSpectating: boolean;
  onOpenCards: () => void;
  loadingAction?: string | null;
}

export function MyCardBox({
  card,
  isCardOpen,
  showOpenButton,
  isSpectating,
  onOpenCards,
  loadingAction = null,
}: MyCardBoxProps) {
  const canShowButton = showOpenButton && !isSpectating && !isCardOpen;
  const isLoading = loadingAction === "openCard";

  return (
    <div className="ito-box flex h-full min-h-[300px] w-full flex-col items-center p-5">
      <span className="mb-4 text-sm font-bold tracking-widest text-black">
        あなたの数字
      </span>

      <PlayingCard card={card} isCardOpen={isCardOpen} />

      <button
        className={`ito-btn ito-btn-dark mt-6 w-full py-3 text-sm transition-all ${canShowButton ? "" : "invisible"} ${isLoading ? "cursor-not-allowed opacity-50" : ""} `}
        disabled={!canShowButton || isLoading}
        onClick={isLoading ? undefined : onOpenCards}
      >
        {isLoading ? "公開中..." : isCardOpen ? "公開済み" : "カードを開ける"}
      </button>
    </div>
  );
}
