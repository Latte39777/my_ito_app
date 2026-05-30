"use client";

import { playerSchema } from "@/types/schema";

interface MyCardBoxProps {
  card: number | null;
  isCardOpen: boolean;
  showOpenButton: boolean;
  isSpectating: boolean;
  onOpenCards: () => void;
}
export function MyCardBox({
  card,
  showOpenButton,
  isSpectating,
  onOpenCards,
}: MyCardBoxProps) {
  // ボタンを表示すべき条件を明確にする
  const canShowButton = showOpenButton && !isSpectating;

  return (
    <div className="ito-box flex flex-col items-center p-4 w-full h-full min-h-[240px]">
      <span className="text-md font-bold text-black mb-auto">あなたの数字</span>

      <span className="text-7xl font-black text-black my-auto tracking-tighter">
        {card !== null ? card : "?"}
      </span>

      <button
        // 💡 観戦者なら invisible になるよう条件を修正
        className={`ito-btn ito-btn-dark py-2 mt-auto text-sm ${canShowButton ? "" : "invisible"}`}
        // 💡 観戦者は disabled を強制的に true にする
        disabled={!canShowButton}
        onClick={onOpenCards}
      >
        カードを開ける
      </button>
    </div>
  );
}
