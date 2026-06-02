"use client";

import { useState } from "react";

interface EditAnswerModalProps {
  onClose: () => void;
  currentAnswer: string;
  onSave: (newAnswer: string) => void;
}

export function EditAnswerModal({
  onClose,
  currentAnswer,
  onSave,
}: EditAnswerModalProps) {
  const [editText, setEditText] = useState(currentAnswer);

  const handleSave = () => {
    if (!editText.trim() || editText === currentAnswer) return;
    onSave(editText.trim());
  };

  return (
    <div className="ito-modal-backdrop px-4" onClick={onClose}>
      <div
        className="ito-modal-card flex w-full max-w-sm flex-col gap-4 p-5 md:gap-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="ito-modal-title text-lg md:text-xl">回答の変更</h2>

        <div className="flex flex-col gap-1.5 md:gap-2">
          <input
            type="text"
            maxLength={30}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="ito-modal-input p-2.5 text-base md:p-3 md:text-xl"
            placeholder="新しい回答"
          />
        </div>

        <div className="mt-2 flex w-full gap-2 md:mt-4 md:justify-end md:gap-3">
          <button
            onClick={onClose}
            className="ito-modal-btn-secondary flex-1 px-4 py-2.5 text-sm md:flex-none md:px-5 md:py-2 md:text-base"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!editText.trim() || editText === currentAnswer}
            className="ito-modal-btn-primary flex-1 px-4 py-2.5 text-sm md:flex-none md:px-5 md:py-2 md:text-base"
          >
            変更する
          </button>
        </div>
      </div>
    </div>
  );
}
