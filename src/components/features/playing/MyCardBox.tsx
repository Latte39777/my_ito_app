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
    // 💡 修正1: スマホ用の min-h を 250px から 160px まで一気に縮め、内側の余白(p)も p-2 に減らしました
    <div className="ito-box flex h-full min-h-[160px] w-full flex-col items-center p-2 md:min-h-[270px] md:p-4 lg:min-h-[300px] lg:p-5">
      {/* 💡 修正2: `hidden md:block` を追加し、スマホでは完全に消し去ります */}
      <span className="mb-3 hidden text-xs font-bold tracking-widest text-black md:mb-4 md:block md:text-sm lg:text-sm">
        あなたの数字
      </span>

      <div className="flex flex-1 items-center justify-center">
        <PlayingCard card={card} isCardOpen={isCardOpen} />
      </div>

      <button
        className={`ito-btn ito-btn-dark mt-2 w-full py-0.5 text-xs transition-all md:mt-5 md:py-2.5 md:text-sm lg:mt-6 lg:py-3 ${canShowButton ? "" : "invisible"} ${isLoading ? "cursor-not-allowed opacity-50" : ""} `}
        disabled={!canShowButton || isLoading}
        onClick={isLoading ? undefined : onOpenCards}
      >
        {isLoading ? "公開中..." : isCardOpen ? "公開済み" : "カードを開ける"}
      </button>
    </div>
  );
}
