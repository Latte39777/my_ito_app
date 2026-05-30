"use client";

import { TbHeartFilled, TbPlus, TbMinus } from "react-icons/tb";

interface LifeBoxProps {
  life: number;
  isHost: boolean;
  onChangeLife?: (newLife: number) => void;
}

export function LifeBox({ life, isHost, onChangeLife }: LifeBoxProps) {
  return (
    // 💡 高さを固定して、箱のサイズが変わらないようにする
    <div className="ito-box p-4 flex items-center justify-between min-w-[180px] h-[80px]">
      {/* 💡 全て「♡×N」表示に統一 */}
      <div className="flex-1 flex justify-center items-center">
        <span className="text-3xl font-black text-black tracking-widest flex items-center gap-1">
          <TbHeartFilled size={40} className="text-[#E63946]" />
          <span className="text-4xl font-black text-black px-3">× {life}</span>
        </span>
      </div>

      {/* ホスト専用ボタン */}
      {isHost && (
        <div className="flex flex-col gap-1 border-l-2 border-black pl-2 ml-2">
          <button
            onClick={() => onChangeLife?.(life + 1)}
            className="text-black hover:bg-gray-200 p-1 rounded font-black text-xl transition-colors cursor-pointer"
          >
            <TbPlus />
          </button>
          <button
            onClick={() => onChangeLife?.(life - 1)}
            className="text-black hover:bg-gray-200 p-1 rounded font-black text-xl transition-colors cursor-pointer"
          >
            <TbMinus />
          </button>
        </div>
      )}
    </div>
  );
}
