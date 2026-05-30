"use client";

import { Player } from "@/types/schema";
import { PlayerInfo } from "@/components/shared/PlayerInfo";

interface AnswerCardProps {
  player: Player;
  isMe: boolean;
  onEditAnswer: (currentText: string) => void;
}

export function AnswerCard({ player, isMe, onEditAnswer }: AnswerCardProps) {
  return (
    <div className="ito-box p-4 flex flex-col gap-2">
      {/* 💡 ヘッダーレイアウトを PlayerInfo コンポーネントでスッキリ統一！ */}
      <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2 mb-1">
        <PlayerInfo player={player} isMe={isMe} size="md" />

        {/* 自分だけ「回答を変更」ボタン */}
        {isMe && (
          <button
            onClick={() => onEditAnswer(player.answerText || "")}
            className="text-sm font-bold hover:text-black transition-colors cursor-pointer text-gray-400 shrink-0 ml-2"
          >
            回答を変更
          </button>
        )}
      </div>

      {/* 回答と数字 */}
      <div className="flex justify-between items-center mt-2 gap-4">
        <div className="text-2xl font-black text-black break-words overflow-hidden leading-tight flex-1">
          {player.answerText || "..."}
        </div>

        <div className="text-5xl font-black text-black shrink-0">
          {player.isCardOpen ? player.card : "?"}
        </div>
      </div>
    </div>
  );
}
