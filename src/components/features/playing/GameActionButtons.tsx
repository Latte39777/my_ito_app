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
    <div className="flex flex-col gap-3">
      {isHost && (
        <ConfirmButton
          onConfirm={onNextRound}
          defaultText={
            loadingAction === "nextRound" ? "処理中..." : "つぎのお題"
          }
          confirmText="本当に次へ進む？"
          baseClassName={`ito-btn ito-btn-primary w-full py-3 ${
            loadingAction === "nextRound" ? "opacity-50 cursor-not-allowed" : ""
          } ${isProcessing && loadingAction !== "nextRound" ? "cursor-not-allowed" : ""}`}
          // 💡 赤やオレンジを避け、元の青より少し濃い青にして変化を伝える
          confirmClassName="!bg-blue-700"
          disabled={isProcessing}
        />
      )}

      <ConfirmButton
        onConfirm={onLeaveRoom}
        defaultText="やめる"
        confirmText="本当にやめる？"
        baseClassName={`ito-btn ito-btn-outline w-full mt-2 ${
          isProcessing ? "cursor-not-allowed" : ""
        }`}
        confirmClassName="!bg-red-500 !text-white !border-black"
        disabled={isProcessing}
      />
    </div>
  );
}
