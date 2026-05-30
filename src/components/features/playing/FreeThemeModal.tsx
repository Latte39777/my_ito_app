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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className="animate-fade-in flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="border-b-2 border-gray-100 pb-2 text-2xl font-black text-black">
          フリーお題作成
        </h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500">お題</label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 p-2 text-lg font-bold text-black transition-colors focus:border-blue-500 focus:outline-none"
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
              className="w-full rounded-lg border-2 border-gray-200 p-2 text-lg font-bold text-black transition-colors focus:border-blue-500 focus:outline-none"
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
              className="w-full rounded-lg border-2 border-gray-200 p-2 text-lg font-bold text-black transition-colors focus:border-blue-500 focus:outline-none"
              placeholder="例：神アニメ"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2 font-bold text-gray-500 transition-colors hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={
              !customTitle.trim() || !customLow.trim() || !customHigh.trim()
            }
            className="rounded-lg bg-blue-500 px-5 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            作成する
          </button>
        </div>
      </div>
    </div>
  );
}
