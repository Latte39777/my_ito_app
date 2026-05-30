"use client";

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
  loadingAction = null, // 💡 追加
}: MyCardBoxProps) {
  const canShowButton = showOpenButton && !isSpectating && !isCardOpen;
  const isLoading = loadingAction === "openCard"; // 💡 自分の処理中かどうか

  return (
    <div className="ito-box flex flex-col items-center p-5 w-full h-full min-h-[300px]">
      <span className="text-sm font-bold text-gray-400 mb-4 tracking-widest">
        あなたの数字
      </span>

      {/* 💡 本物のカード風のデザイン！ */}
      <div
        className={`relative flex items-center justify-center w-32 h-44 my-auto bg-white rounded-xl border-2 border-gray-200 transition-all duration-300 select-none
          ${isCardOpen ? "shadow-none bg-gray-50 border-dashed" : "shadow-lg hover:-translate-y-2 hover:shadow-2xl"}
        `}
      >
        {/* 左上の小さな数字（トランプ風） */}
        {card !== null && !isCardOpen && (
          <span className="absolute top-2 left-2 text-sm font-black text-gray-300">
            {card}
          </span>
        )}

        {/* 中央の大きな数字 */}
        <span
          className={`text-7xl font-black tracking-tighter ${
            isCardOpen ? "text-gray-300" : "text-black"
          }`}
        >
          {card !== null ? card : "?"}
        </span>

        {/* 右下の逆さまの数字（トランプ風） */}
        {card !== null && !isCardOpen && (
          <span className="absolute bottom-2 right-2 text-sm font-black text-gray-300 rotate-180">
            {card}
          </span>
        )}
      </div>

      {/* 💡 ボタンも連打防止に対応 */}
      <button
        className={`ito-btn ito-btn-dark w-full py-3 mt-6 text-sm transition-all
          ${canShowButton ? "" : "invisible"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
        disabled={!canShowButton || isLoading}
        onClick={isLoading ? undefined : onOpenCards}
      >
        {isLoading ? "公開中..." : isCardOpen ? "公開済み" : "カードを開ける"}
      </button>
    </div>
  );
}
