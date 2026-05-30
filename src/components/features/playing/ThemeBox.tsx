"use client";

import { THEMES_LIST } from "@/data/themes";
import { Theme } from "@/types/schema";

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
  const handleRandomTheme = () => {
    if (!onChangeTheme || isProcessing) return; // 処理中は弾く
    const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
    onChangeTheme(THEMES_LIST[randomIndex]);
  };

  const handleFreeTheme = () => {
    if (!onChangeTheme || isProcessing) return; // 処理中は弾く

    // ※ 後でここは綺麗なモーダルに書き換えますが、一旦今のままにしておきます
    const customTitle = prompt(
      "お題を入力してください",
      "例：好きなアニメは？",
    )?.trim();
    if (!customTitle) return;
    const customLow = prompt(
      "数字が小さい時の言葉",
      "例：おもしろくない",
    )?.trim();
    if (!customLow) return;
    const customHigh = prompt("数字が大きい時の言葉", "例：神アニメ")?.trim();
    if (!customHigh) return;

    onChangeTheme({
      id: crypto.randomUUID(),
      title: customTitle,
      low: customLow,
      high: customHigh,
    });
  };

  return (
    <div className="ito-box relative p-5 md:p-4 flex flex-col items-center justify-center gap-2 min-h-[120px] w-full">
      <h3 className="text-2xl md:text-3xl font-black text-black text-center mt-2">
        お題：{theme?.title || "未設定"}
      </h3>
      <p className="text-lg md:text-xl font-bold text-center text-gray-800 mt-1">
        1：{theme?.low || "min"} 〜 100：{theme?.high || "max"}
      </p>

      {isHost && (
        <div className="absolute bottom-3 right-4 flex gap-4 text-sm font-bold z-10">
          <button
            onClick={handleRandomTheme}
            disabled={isProcessing}
            className={`text-gray-400 hover:text-black transition-colors ${loadingAction === "theme" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            お題変更
          </button>
          <button
            onClick={handleFreeTheme}
            disabled={isProcessing}
            className={`text-gray-400 hover:text-black transition-colors ${loadingAction === "theme" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            フリーお題
          </button>
        </div>
      )}
      <div className="ito-speech-tail"></div>
    </div>
  );
}
