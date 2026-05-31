"use client";

import { useState } from "react";
import { Player } from "@/types/schema";
import { PlayerInfo } from "@/components/shared/PlayerInfo";

interface AnswerInputBoxProps {
  player: Player;
  onSubmitAnswer: (answer: string) => void;
  isProcessing?: boolean;
}

export function AnswerInputBox({
  player,
  onSubmitAnswer,
  isProcessing = false,
}: AnswerInputBoxProps) {
  const [text, setText] = useState(player.answerText || "");

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (!trimmedText || isProcessing) return;
    onSubmitAnswer(trimmedText);
    setText(trimmedText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="ito-wide-container flex flex-col gap-8">
      <div className="ito-box flex flex-col overflow-hidden">
        {/* 上部：プレイヤー情報 */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-gray-100 bg-white p-2 px-4">
          <PlayerInfo player={player} isMe={true} isSmall={false} />
          <span className="shrink-0 text-[10px] font-bold text-gray-400">
            回答の入力
          </span>
        </div>

        {/* 下部：入力フィールド */}
        <div className="bg-white p-6">
          <input
            type="text"
            maxLength={30}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="回答の入力"
            className="w-full border-none bg-transparent text-center text-2xl font-bold text-black placeholder-gray-300 focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isProcessing}
        className="ito-btn ito-btn-primary px-4 py-4 transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "送信中..." : "回答を送信"}
      </button>
    </div>
  );
}
