// src/components/features/playing/GameActionButtons.tsx
"use client";

import { ConfirmButton } from "@/components/shared/ConfirmButton";

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
    // 💡 修正1: 全体の隙間(gap)を画面サイズに合わせて微調整
    <div className="flex flex-col gap-2 md:gap-2.5 lg:gap-3">
      {isHost && (
        <ConfirmButton
          onConfirm={onNextRound}
          defaultText={
            loadingAction === "nextRound" ? "処理中..." : "つぎのお題"
          }
          confirmText="本当に次へ進む？"
          // 💡 修正2: 「つぎのお題」ボタンの高さ(py)と文字サイズを段階的に変化
          // 今の lg:py-3 を基準にして、md では py-2.5、スマホでは py-2 とします
          baseClassName={`ito-btn ito-btn-primary w-full py-2 text-sm md:py-2.5 md:text-base lg:py-3 ${
            loadingAction === "nextRound" ? "opacity-50 cursor-not-allowed" : ""
          } ${isProcessing && loadingAction !== "nextRound" ? "cursor-not-allowed" : ""}`}
          confirmClassName="!bg-blue-700"
          disabled={isProcessing}
        />
      )}

      <ConfirmButton
        onConfirm={onLeaveRoom}
        defaultText="やめる"
        confirmText="本当にやめる？"
        // 💡 修正3: 「やめる」ボタンも同様に段階的に変化させ、上部余白(mt)も調整
        baseClassName={`ito-btn ito-btn-outline w-full mt-1 py-2 text-sm md:mt-1.5 md:py-0.5 md:text-base lg:mt-2 lg:py-1 ${
          isProcessing ? "cursor-not-allowed" : ""
        }`}
        confirmClassName="!bg-red-500 !text-white !border-black"
        disabled={isProcessing}
      />
    </div>
  );
}
