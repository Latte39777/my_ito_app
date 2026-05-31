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
      {/* 右上の「？」ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="ito-box flex h-8 w-8 items-center justify-center text-xl transition-transform md:h-10 md:w-10"
        aria-label="ルール説明"
      >
        <TbHelpCircleFilled size={24} />
      </button>

      {/* モーダル本体 */}
      {isOpen && (
        <div className="ito-modal-backdrop" onClick={handleBackdropClick}>
          <div
            className="ito-modal-card max-h-[80vh] max-w-md gap-5 overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="ito-modal-title">遊び方・ルール</h2>

            <div className="flex flex-col gap-4 leading-relaxed font-bold text-gray-700">
              <p>ナンバートークは、みんなで価値観を合わせる協力ゲームです！</p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  1〜100の数字カードが1人1枚ずつ配られます（自分だけ見れます）。
                </li>
                <li>
                  お題（例：「持ち歩きたいもの」）に合わせて、自分の数字の大きさを言葉で表現します。
                </li>
                <li>数字を直接言ってはいけません！</li>
                <li>
                  みんなで話し合い、数字が「小さい順」になるようにカードを開けていきましょう。
                </li>
                <li>全員順番通りに開けられたらクリア！</li>
              </ul>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="ito-modal-btn-primary px-6 py-3"
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
