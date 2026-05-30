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
      <div className="ito-box flex flex-col gap-2 p-4">
        <div className="mb-1 flex items-center justify-between border-b-2 border-gray-100 pb-2">
          <PlayerInfo player={player} isMe={isMe} size="md" />

          {isMe && (
            <button
              onClick={() => setIsOpen(true)} // 💡 モーダルを開く
              className="ml-2 shrink-0 cursor-pointer text-sm font-bold text-gray-400 transition-colors hover:text-black"
            >
              回答を変更
            </button>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <div className="flex-1 text-2xl leading-tight font-black break-words text-black">
            {player.answerText || "..."}
          </div>
          <div className="font-hana shrink-0 text-5xl font-black text-black">
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
