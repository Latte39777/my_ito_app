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
    <div
      className="ito-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="ito-modal-card flex w-full max-w-sm flex-col gap-4 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="ito-modal-title">フリーお題作成</h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500">お題</label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            maxLength={30}
            className="ito-modal-input w-full p-2 text-lg"
            placeholder="例：好きなアニメは？"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex w-1/2 flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">
              数字が小さい時
            </label>
            <input
              type="text"
              value={customLow}
              onChange={(e) => setCustomLow(e.target.value)}
              maxLength={15}
              className="ito-modal-input w-full p-2 text-lg"
              placeholder="例：おもしろくない"
            />
          </div>
          <div className="flex w-1/2 flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">
              数字が大きい時
            </label>
            <input
              type="text"
              value={customHigh}
              onChange={(e) => setCustomHigh(e.target.value)}
              maxLength={15}
              className="ito-modal-input w-full p-2 text-lg"
              placeholder="例：神アニメ"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="ito-modal-btn-secondary px-5 py-2"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={
              !customTitle.trim() || !customLow.trim() || !customHigh.trim()
            }
            className="ito-modal-btn-primary px-5 py-2"
          >
            作成する
          </button>
        </div>
      </div>
    </div>
  );
}
