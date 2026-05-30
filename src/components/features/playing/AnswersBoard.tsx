"use client";

import { Player } from "@/types/schema";
import { AnswerCard } from "./AnswerCard";

interface AnswersBoardProps {
  players: Player[];
  myPlayerId: string;
  onEditAnswer: (currentText: string) => void;
}
export function AnswersBoard({
  players,
  myPlayerId,
  onEditAnswer,
}: AnswersBoardProps) {
  const playingPlayers = players.filter((p) => !p.isSpectating);

  return (
    <div className="w-full max-w-[1000px] mx-auto mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playingPlayers.map((p) => (
          <AnswerCard
            key={p.id}
            player={p}
            isMe={p.id === myPlayerId}
            onEditAnswer={onEditAnswer}
          />
        ))}
      </div>
    </div>
  );
}
