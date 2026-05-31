"use client";

import { useState } from "react";
import { Player } from "@/types/schema";
import { PlayerInfo } from "@/components/shared/PlayerInfo";
import { EditAnswerModal } from "./EditAnswerModal";

interface AnswerCardProps {
  player: Player;
  isMe: boolean;
  onEditAnswer: (newAnswer: string) => void;
}

export function AnswerCard({ player, isMe, onEditAnswer }: AnswerCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (newAnswer: string) => {
    onEditAnswer(newAnswer);
    setIsOpen(false);
  };

  return (
    <>
      <div className="ito-box flex flex-col px-4 py-2 md:gap-2">
        {/* 💡 修正: `mb:pb-2` のタイポを `md:pb-2` に修正しました */}
        <div className="mb-1 border-b-2 border-gray-100 pb-1 md:pb-2">
          <PlayerInfo
            player={player}
            isMe={isMe}
            isSmall={false}
            actionButton={
              isMe ? (
                <button
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer text-[10px] font-bold whitespace-nowrap text-gray-400 transition-colors hover:text-black md:text-[11px] lg:text-[12px]"
                >
                  回答を変更
                </button>
              ) : undefined
            }
          />
        </div>

        {/* 💡 修正1: 上の余白(mt)と、テキストと数字の隙間(gap)をスマホ用に縮小 */}
        <div className="mt-1 flex items-center justify-between gap-2 md:mt-2 md:gap-4">
          {/* 💡 修正2: 回答のテキストをスマホ時は text-base(またはtext-lg) くらいまでスリムに */}
          <div className="flex-1 text-lg leading-tight font-black break-words text-black md:text-xl lg:text-2xl">
            {player.answerText || "..."}
          </div>

          {/* 💡 修正3: 右の数字も text-5xl から text-4xl に落とし、下の余白(pb)も削りました */}
          <div className="font-hana shrink-0 pb-1 text-4xl font-black text-black md:pb-2 md:text-5xl">
            {player.isCardOpen ? player.card : "?"}
          </div>
        </div>
      </div>

      {isOpen && (
        <EditAnswerModal
          onClose={() => setIsOpen(false)}
          currentAnswer={player.answerText || ""}
          onSave={handleSave}
        />
      )}
    </>
  );
}
