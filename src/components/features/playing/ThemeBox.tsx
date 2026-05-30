"use client";

import { useState } from "react";
import { THEMES_LIST } from "@/data/themes";
import { Theme } from "@/types/schema";
import { FreeThemeModal } from "./FreeThemeModal"; // 💡 追加

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
      <div className="ito-box relative flex min-h-[120px] w-full flex-col items-center justify-center gap-2 p-5 md:p-4">
        <h3 className="font-hana mt-2 text-center text-2xl font-black text-black md:text-3xl">
          お題：{theme?.title || "未設定"}
        </h3>
        <p className="font-hana mt-1 text-center text-lg font-bold text-gray-800 md:text-xl">
          1：{theme?.low || "min"} 〜 100：{theme?.high || "max"}
        </p>

        {isHost && (
          <div className="absolute right-4 bottom-3 z-10 flex gap-4 text-sm font-bold">
            <button
              onClick={handleRandomTheme}
              disabled={isProcessing}
              className={`text-gray-400 transition-colors hover:text-black ${loadingAction === "theme" ? "cursor-not-allowed opacity-50" : ""}`}
            >
              お題変更
            </button>
            <button
              onClick={() => setIsOpen(true)} // 💡 モーダルを開く
              disabled={isProcessing}
              className={`text-gray-400 transition-colors hover:text-black ${loadingAction === "theme" ? "cursor-not-allowed opacity-50" : ""}`}
            >
              フリーお題
            </button>
          </div>
        )}
        <div className="ito-speech-tail"></div>
      </div>

      {/* 💡 開いている時だけ描画（マウント）する */}
      {isOpen && (
        <FreeThemeModal
          onClose={() => setIsOpen(false)}
          onSave={handleSaveFreeTheme}
        />
      )}
    </>
  );
}
