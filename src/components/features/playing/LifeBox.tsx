"use client";

import { TbHeartFilled, TbPlus, TbMinus } from "react-icons/tb";

interface LifeBoxProps {
  life: number;
  isHost: boolean;
  onChangeLife?: (newLife: number) => void;
  isProcessing?: boolean;
  loadingAction?: string | null;
}

export function LifeBox({
  life,
  isHost,
  onChangeLife,
  isProcessing = false,
  loadingAction,
}: LifeBoxProps) {
  return (
    <div className="ito-box flex min-h-[36px] w-full items-center justify-between px-1 py-1 md:min-h-[60px] md:p-2 lg:min-h-[80px] lg:p-4">
      <div className="flex flex-1 items-center justify-center">
        <span className="flex items-center gap-1 text-xl font-black tracking-widest whitespace-nowrap text-black md:gap-2 md:text-3xl lg:text-4xl">
          <TbHeartFilled className="shrink-0 text-[#E63946]" />
          <span className="pl-1 md:px-2">× {life}</span>
        </span>
      </div>

      {isHost && (
        <div className="ml-1 flex shrink-0 flex-row items-center border-l-2 border-black pl-1 md:ml-2 md:flex-col md:pl-2">
          <button
            onClick={() => onChangeLife?.(life + 1)}
            disabled={isProcessing}
            className={`rounded p-0.5 text-lg font-black text-black transition-colors hover:bg-gray-200 md:p-1 md:text-xl ${loadingAction === "life" ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <TbPlus />
          </button>
          <button
            onClick={() => onChangeLife?.(life - 1)}
            disabled={isProcessing}
            className={`rounded p-0.5 text-lg font-black text-black transition-colors hover:bg-gray-200 md:p-1 md:text-xl ${loadingAction === "life" ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <TbMinus />
          </button>
        </div>
      )}
    </div>
  );
}
