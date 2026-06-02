"use client";

import { useState } from "react";
import { TbHelpCircleFilled } from "react-icons/tb";

export function RulesModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ito-box flex h-8 w-8 items-center justify-center text-xl transition-transform md:h-10 md:w-10"
        aria-label="ルール説明"
      >
        <TbHelpCircleFilled size={24} />
      </button>

      {isOpen && (
        <div className="ito-modal-backdrop px-4" onClick={handleBackdropClick}>
          <div
            className="ito-modal-card flex max-h-[85vh] w-full max-w-md flex-col gap-4 overflow-y-auto p-5 md:max-h-[80vh] md:gap-5 md:p-6"
            onClick={(event) => event.stopPropagation()}
            style={{ scrollbarWidth: "thin" }}
          >
            <h2 className="ito-modal-title text-lg md:text-xl">
              遊び方・ルール
            </h2>

            <div className="flex flex-col gap-3 text-sm leading-relaxed font-bold text-gray-700 md:gap-4 md:text-base">
              <p>ナンバートークは、みんなで価値観を合わせる協力ゲームです！</p>

              <ul className="flex list-disc flex-col gap-1.5 pl-5 md:gap-2">
                <li>
                  1〜100の数字カードが1人1枚ずつ配られます（自分だけ見れます）。
                </li>
                <li>
                  お題（例：「持ち歩きたいもの」）に合わせて、自分の数字の大きさを言葉で表現します。
                </li>
                <li>
                  <span className="text-red-500">
                    数字を直接言ってはいけません！
                  </span>
                </li>
                <li>
                  みんなで話し合い、数字が「小さい順」になるようにカードを開けていきましょう。
                </li>
                <li>全員順番通りに開けられたらクリア！</li>
              </ul>
            </div>

            <div className="mt-2 flex w-full justify-center md:mt-4 md:justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="ito-modal-btn-primary w-full px-6 py-2.5 text-sm md:w-auto md:py-3 md:text-base"
              >
                とじる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
