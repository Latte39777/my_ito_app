"use client";

import { useState } from "react";
import { Player } from "@/types/schema";
import { PlayerInfo } from "@/components/shared/PlayerInfo";

interface AnswerInputBoxProps {
  player: Player;
  onSubmitAnswer: (answer: string) => void;
  isProcessing?: boolean; // 💡 追加：処理中を受け取る
}

export function AnswerInputBox({
  player,
  onSubmitAnswer,
  isProcessing = false, // 💡 追加
}: AnswerInputBoxProps) {
  const [text, setText] = useState(player.answerText || "");

  const handleSubmit = () => {
    if (!text.trim() || isProcessing) return; // 💡 処理中は弾く
    onSubmitAnswer(text);
    // setText(""); // 送信後はコンポーネントが切り替わるのでここではクリアしなくてもOK
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1000px] mx-auto mt-4">
      <div className="ito-box flex flex-col overflow-hidden">
        {/* 上部：プレイヤー情報 */}
        <div className="flex justify-between items-center p-2 px-4 border-b-2 border-gray-100 bg-white">
          <PlayerInfo player={player} isMe={true} size="md" />
          <span className="text-[10px] text-gray-400 font-bold shrink-0">
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
            onKeyDown={handleKeyDown}
            disabled={isProcessing} // 💡 送信中は入力をロック
            placeholder="回答の入力"
            className="w-full text-2xl font-bold text-black border-none focus:outline-none placeholder-gray-300 text-center bg-transparent disabled:opacity-50"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isProcessing} // 💡 送信中はボタンをロック
        className="ito-btn ito-btn-primary py-4 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isProcessing ? "送信中..." : "回答を送信"}
      </button>
    </div>
  );
}
