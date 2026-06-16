"use client";

import { useState } from "react";
import { Theme } from "@/types/schema";

interface FreeThemeModalProps {
  onClose: () => void;
  onSave: (theme: Theme) => void;
}

export function FreeThemeModal({ onClose, onSave }: FreeThemeModalProps) {
  const [customTitle, setCustomTitle] = useState("");
  const [customLow, setCustomLow] = useState("");
  const [customHigh, setCustomHigh] = useState("");

  const handleSave = () => {
    if (!customTitle.trim() || !customLow.trim() || !customHigh.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      title: customTitle.trim(),
      low: customLow.trim(),
      high: customHigh.trim(),
    });
  };

  return (
    <div className="ito-modal-backdrop px-4" onClick={onClose}>
      <div
        className="ito-modal-card flex w-full max-w-sm flex-col gap-4 p-5 md:gap-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="ito-modal-title text-lg md:text-xl">フリーお題作成</h2>

        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="text-xs font-bold text-gray-500 md:text-sm">
            お題
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            maxLength={50}
            className="ito-modal-input p-2.5 text-base md:p-3 md:text-lg"
            placeholder="例：好きなアニメは？"
          />
        </div>

        <div className="flex gap-2 md:gap-3">
          <div className="flex w-1/2 flex-col gap-1 md:gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 md:text-xs">
              数字が小さい時
            </label>
            <input
              type="text"
              value={customLow}
              onChange={(e) => setCustomLow(e.target.value)}
              maxLength={15}
              className="ito-modal-input p-2.5 text-sm md:p-3 md:text-lg"
              placeholder="例：おもしろくない"
            />
          </div>
          <div className="flex w-1/2 flex-col gap-1 md:gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 md:text-xs">
              数字が大きい時
            </label>
            <input
              type="text"
              value={customHigh}
              onChange={(e) => setCustomHigh(e.target.value)}
              maxLength={15}
              className="ito-modal-input p-2.5 text-sm md:p-3 md:text-lg"
              placeholder="例：神アニメ"
            />
          </div>
        </div>

        <div className="mt-2 flex w-full gap-2 md:mt-4 md:justify-end md:gap-3">
          <button
            onClick={onClose}
            className="ito-modal-btn-secondary flex-1 px-4 py-2.5 text-sm md:flex-none md:px-5 md:py-2 md:text-base"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={
              !customTitle.trim() || !customLow.trim() || !customHigh.trim()
            }
            className="ito-modal-btn-primary flex-1 px-4 py-2.5 text-sm md:flex-none md:px-5 md:py-2 md:text-base"
          >
            作成する
          </button>
        </div>
      </div>
    </div>
  );
}
