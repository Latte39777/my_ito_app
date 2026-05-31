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
    // 💡 修正1: p-5, min-h-[300px] を lg の基準とし、md とスマホ用により小さい値を設定
    <div className="ito-box flex h-full min-h-[250px] w-full flex-col items-center p-4 md:min-h-[270px] lg:min-h-[300px] lg:p-5">
      {/* 💡 修正2: テキストサイズと下の余白(mb)を段階的に変化 */}
      <span className="mb-3 text-xs font-bold tracking-widest text-black md:mb-4 md:text-sm lg:text-sm">
        あなたの数字
      </span>

      {/* 💡 修正3: カードの上下の余白を自動でいい感じに取るために flex-1 で囲む */}
      <div className="flex flex-1 items-center justify-center">
        <PlayingCard card={card} isCardOpen={isCardOpen} />
      </div>

      <button
        // 💡 修正4: 上の余白(mt)、ボタンの高さ(py)、文字サイズ(text) を段階的に変化
        className={`ito-btn ito-btn-dark mt-4 w-full py-2 text-xs transition-all md:mt-5 md:py-2.5 md:text-sm lg:mt-6 lg:py-3 ${canShowButton ? "" : "invisible"} ${isLoading ? "cursor-not-allowed opacity-50" : ""} `}
        disabled={!canShowButton || isLoading}
        onClick={isLoading ? undefined : onOpenCards}
      >
        {isLoading ? "公開中..." : isCardOpen ? "公開済み" : "カードを開ける"}
      </button>
    </div>
  );
}
