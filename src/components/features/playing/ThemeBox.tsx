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
      <div className="ito-box relative flex w-full flex-col p-3 md:min-h-[120px] md:p-4 lg:min-h-[130px] lg:p-5">
        <div className="flex flex-1 flex-col items-center justify-center">
          <h3 className="font-hana text-center text-xl leading-tight font-black text-black md:text-2xl lg:text-3xl">
            お題：{theme?.title || "未設定"}
          </h3>
          <p className="font-hana mt-1 text-center text-sm leading-tight font-bold break-words text-gray-800 md:mt-2 md:text-base lg:text-lg">
            1：{theme?.low || "min"} 〜 100：{theme?.high || "max"}
          </p>
        </div>

        {isHost && (
          <div className="mt-auto -mr-1 -mb-3 flex w-full justify-end gap-3 text-xs font-bold md:-mr-2 md:-mb-3 md:text-sm lg:gap-4">
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
