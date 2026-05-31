"use client";

import { useState } from "react";
import { THEMES_LIST } from "@/data/themes";
import { Theme } from "@/types/schema";
import { FreeThemeModal } from "./FreeThemeModal";

interface ThemeBoxProps {
  theme: Theme | null;
  isHost: boolean;
  onChangeTheme?: (newTheme: Theme) => void;
  isProcessing?: boolean;
  loadingAction?: string | null;
}

export function ThemeBox({
  theme,
  isHost,
  onChangeTheme,
  isProcessing = false,
  loadingAction,
}: ThemeBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRandomTheme = () => {
    if (!onChangeTheme || isProcessing) return;
    const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
    onChangeTheme(THEMES_LIST[randomIndex]);
  };

  const handleSaveFreeTheme = (newTheme: Theme) => {
    if (!onChangeTheme) return;
    onChangeTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🌟 修正1: items-center を外して、親をシンプルな縦並び（flex-col）にする */}
      <div className="ito-box relative flex min-h-[120px] w-full flex-col p-4 md:p-6">
        <div className="flex flex-1 flex-col items-center justify-center gap-1 pb-4">
          <h3 className="font-hana mt-2 text-center text-2xl font-black text-black md:text-3xl lg:text-4xl">
            お題：{theme?.title || "未設定"}
          </h3>
          {/* break-words を追加して、長いテキストでもはみ出さずに折り返すようにする */}
          <p className="font-hana -mb-4 pt-2 text-center text-lg font-bold break-words text-gray-800 md:text-xl">
            1：{theme?.low || "min"} 〜 100：{theme?.high || "max"}
          </p>
        </div>

        {isHost && (
          <div className="mt-auto -mb-4 flex w-full justify-end gap-4 text-sm font-bold">
            <button
              onClick={handleRandomTheme}
              disabled={isProcessing}
              className={`text-gray-400 transition-colors hover:text-black ${loadingAction === "theme" ? "cursor-not-allowed opacity-50" : ""}`}
            >
              お題変更
            </button>
            <button
              onClick={() => setIsOpen(true)}
              disabled={isProcessing}
              className={`text-gray-400 transition-colors hover:text-black ${loadingAction === "theme" ? "cursor-not-allowed opacity-50" : ""}`}
            >
              フリーお題
            </button>
          </div>
        )}
        <div className="ito-speech-tail"></div>
      </div>

      {isOpen && (
        <FreeThemeModal
          onClose={() => setIsOpen(false)}
          onSave={handleSaveFreeTheme}
        />
      )}
    </>
  );
}
