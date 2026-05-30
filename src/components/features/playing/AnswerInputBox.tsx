"use client";

import { useState } from "react";
import { Player } from "@/types/schema";
// 💡 待合室で使っているアイコンリストをインポート（パスは合わせてね）
import { AVAILABLE_ICONS } from "@/data/icon";

interface AnswerInputBoxProps {
  player: Player;
  onSubmitAnswer: (answer: string) => void;
}

export function AnswerInputBox({
  player,
  onSubmitAnswer,
}: AnswerInputBoxProps) {
  // 入力中のテキストを保持する
  const [text, setText] = useState(player.answerText || "");

  const iconData =
    AVAILABLE_ICONS.find((i) => i.id === player.icon) || AVAILABLE_ICONS[0];
  const IconComponent = iconData.Icon;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1000px] mx-auto mt-4">
      {/* 吹き出し風の入力ボックス */}
      <div className="ito-box flex flex-col overflow-hidden">
        {/* 上部：プレイヤー情報 */}
        <div className="flex justify-between items-center p-2 px-4 border-b-2 border-gray-100 bg-white">
          <div className="flex items-center gap-1">
            <div className="w-[30px] h-[30px] flex items-center justify-center shrink-0">
              <IconComponent size={30} className={iconData.color} />
            </div>
            <span className="font-bold text-black text-2xl truncate max-w-[120px]">
              {player.name}
            </span>
            {player.isHost && (
              <span className="text-lg text-yellow-600 font-bold ml-1">
                👑ホスト
              </span>
            )}
            <span className="text-lg text-blue-600 font-bold ml-1">
              👤あなた
            </span>
          </div>
          {/* 送信済みの場合は「解答を変更」などのテキストを出してもOK */}
          <span className="text-[10px] text-gray-400 font-bold">
            回答の入力
          </span>
        </div>

        {/* 下部：入力フィールド */}
        <div className="p-6 bg-white">
          <input
            type="text"
            maxLength={30}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="回答の入力"
            className="w-full text-2xl font-bold text-black border-none focus:outline-none placeholder-gray-300 text-center bg-transparent"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <button
        onClick={() => onSubmitAnswer(text)}
        disabled={!text.trim()} // 空っぽの時は押せないようにする
        className="ito-btn ito-btn-primary py-4 px-4 disabled:opacity-50"
      >
        回答を送信
      </button>
    </div>
  );
}
