// src/components/features/playing/GameActionButtons.tsx
"use client";

interface GameActionButtonsProps {
  isHost: boolean;
  isProcessing: boolean;
  loadingAction: string | null;
  onNextRound: () => void;
  onLeaveRoom: () => void;
}

export function GameActionButtons({
  isHost,
  isProcessing,
  loadingAction,
  onNextRound,
  onLeaveRoom,
}: GameActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      {isHost && (
        <button
          // 💡 自分が処理中の時だけ薄くする。それ以外の処理中は見た目を変えない
          className={`ito-btn ito-btn-primary w-full py-3 transition-all ${
            loadingAction === "nextRound" ? "opacity-50 cursor-not-allowed" : ""
          } ${isProcessing && loadingAction !== "nextRound" ? "cursor-not-allowed" : ""}`}
          // 💡 HTMLのdisabledは使わず、処理中なら onClick を無効化（undefined）にする
          onClick={isProcessing ? undefined : onNextRound}
        >
          {loadingAction === "nextRound" ? "処理中..." : "つぎのお題"}
        </button>
      )}
      <button
        // 💡 やめるボタンも同様に、処理中ならカーソルだけ変えて見た目はそのままにする
        className={`ito-btn ito-btn-outline w-full mt-2 transition-all ${
          isProcessing ? "cursor-not-allowed" : ""
        }`}
        // 💡 処理中はクリックしても何も起きないようにガードする
        onClick={isProcessing ? undefined : onLeaveRoom}
      >
        やめる
      </button>
    </div>
  );
}
