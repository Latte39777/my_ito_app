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
    <div className="flex flex-row-reverse items-center gap-3 md:flex-col md:items-stretch md:gap-2.5 lg:gap-3">
      {isHost && (
        <div className="flex-1">
          <ConfirmButton
            onConfirm={onNextRound}
            defaultText={
              loadingAction === "nextRound" ? "処理中..." : "つぎのお題"
            }
            confirmText="本当に次へ進む？"
            baseClassName={`ito-btn ito-btn-primary w-full py-2.5 text-sm md:py-2.5 md:text-base lg:py-3 ${
              loadingAction === "nextRound"
                ? "opacity-50 cursor-not-allowed"
                : ""
            } ${isProcessing && loadingAction !== "nextRound" ? "cursor-not-allowed" : ""}`}
            confirmClassName="!bg-blue-700"
            disabled={isProcessing}
          />
        </div>
      )}

      <div className="flex-1">
        <ConfirmButton
          onConfirm={onLeaveRoom}
          defaultText="やめる"
          confirmText="本当にやめる？"
          baseClassName={`ito-btn ito-btn-outline w-full py-1 text-sm md:text-base  ${
            isProcessing ? "cursor-not-allowed" : ""
          }`}
          confirmClassName="!bg-red-500 !text-white !border-black"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}
