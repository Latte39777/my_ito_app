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
    <div className="ito-box flex min-h-[80px] items-center justify-between p-2 md:p-2 lg:p-4">
      <div className="flex flex-1 items-center justify-center">
        <span className="flex items-center gap-2 text-2xl font-black tracking-widest text-black md:text-3xl lg:text-4xl">
          <TbHeartFilled className="text-[#E63946]" />
          <span className="px-2">× {life}</span>
        </span>
      </div>

      {isHost && (
        <div className="ml-1 flex flex-col gap-1 border-l-2 border-black pl-1 md:ml-1 md:pl-1 lg:ml-2 lg:pl-2">
          <button
            onClick={() => onChangeLife?.(life + 1)}
            disabled={isProcessing}
            className={`rounded p-1 text-xl font-black text-black transition-colors hover:bg-gray-200 ${loadingAction === "life" ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <TbPlus />
          </button>
          <button
            onClick={() => onChangeLife?.(life - 1)}
            disabled={isProcessing}
            className={`rounded p-1 text-xl font-black text-black transition-colors hover:bg-gray-200 ${loadingAction === "life" ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <TbMinus />
          </button>
        </div>
      )}
    </div>
  );
}
