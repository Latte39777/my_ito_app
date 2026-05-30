"use client";

import { THEMES_LIST } from "@/data/themes";
import { Theme } from "@/types/schema";

interface ThemeBoxProps {
  theme: Theme | null;
  isHost: boolean;
  onChangeTheme?: (newTheme: Theme) => void;
}

export function ThemeBox({ theme, isHost, onChangeTheme }: ThemeBoxProps) {
  // 🎲 ランダムにお題を変更する処理
  const handleRandomTheme = () => {
    if (!onChangeTheme) return;
    const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
    onChangeTheme(THEMES_LIST[randomIndex]);
  };

  // ✍️ 自由にお題を作成する処理（ブラウザ標準の入力窓を使うシンプル設計）
  const handleFreeTheme = () => {
    if (!onChangeTheme) return;

    const customTitle = prompt(
      "お題を入力してください",
      "例：好きなアニメは？",
    )?.trim();
    if (!customTitle) return; // キャンセルされたら何もしない

    const customLow = prompt("数字が小さい時の言葉", "例：おもしろくない");
    if (!customLow) return;

    const customHigh = prompt("数字が大きい時の言葉", "例：神アニメ");
    if (!customHigh) return;

    onChangeTheme({
      id: "custom", // 💡 フリーお題用の目印として適当なIDをつける
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

      {/* ホスト専用の編集リンク */}
      {isHost && (
        <div className="absolute bottom-3 right-4 flex gap-4 text-sm text-gray-400 font-bold z-10">
          <button
            onClick={handleRandomTheme}
            className="hover:text-black transition-colors cursor-pointer"
          >
            お題変更
          </button>
          <button
            onClick={handleFreeTheme}
            className="hover:text-black transition-colors cursor-pointer"
          >
            フリーお題
          </button>
        </div>
      )}

      <div className="ito-speech-tail"></div>
    </div>
  );
}
