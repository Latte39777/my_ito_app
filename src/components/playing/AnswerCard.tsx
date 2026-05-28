"use client";

import { AVAILABLE_ICONS } from "@/components/iconList";
import { Player } from "@/types/schema";

interface AnswerCardProps {
  player: Player;
  isMe: boolean;
  onEditAnswer: (currentText: string) => void;
}

export function AnswerCard({ player, isMe, onEditAnswer }: AnswerCardProps) {
  const iconData =
    AVAILABLE_ICONS.find((i) => i.id === player.icon) || AVAILABLE_ICONS[0];
  const IconComponent = iconData.Icon;

  return (
    <div className="ito-box p-4 flex flex-col gap-2">
      {/* 💡 AnswerInputBox と完全に同じヘッダーレイアウト */}
      <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2 mb-1">
        <div className="flex items-center gap-1">
          <div className="w-[30px] h-[30px] flex items-center justify-center shrink-0">
            <IconComponent size={30} className={iconData.color} />
          </div>
          <span className="font-bold text-black text-2xl truncate max-w-[120px]">
            {player.name}
          </span>

          {/* タグ群 */}
          {player.isHost && (
            <span className="text-lg text-yellow-600 font-bold ml-1">
              👑ホスト
            </span>
          )}
          {isMe && (
            <span className="text-lg text-blue-600 font-bold ml-1">
              👤あなた
            </span>
          )}
        </div>

        {/* 💡 自分だけ「回答を変更」ボタン */}
        {isMe && (
          <button
            onClick={() => onEditAnswer(player.answerText || "")}
            className="text-sm font-bold hover:text-black transition-colors cursor-pointer text-gray-400"
          >
            回答を変更
          </button>
        )}
      </div>

      {/* 回答と数字 */}
      <div className="flex justify-between items-center mt-2 gap-4">
        {/* 💡 truncate を外して、break-words と line-clamp-2 を追加 */}
        <div className="text-2xl font-black text-black break-words overflow-hidden leading-tight flex-1">
          {player.answerText || "..."}
        </div>

        {/* 💡 数字は shrink-0 で絶対に小さくならないように固定 */}
        <div className="text-5xl font-black text-black shrink-0">
          {player.isCardOpen ? player.card : "?"}
        </div>
      </div>
    </div>
  );
}
