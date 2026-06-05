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
    <div
      className="ito-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="ito-modal-card flex w-full max-w-sm flex-col gap-5 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="ito-modal-title">回答の変更</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            maxLength={30}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="ito-modal-input w-full p-3 text-xl"
            placeholder="新しい回答"
          />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="ito-modal-btn-secondary px-5 py-2"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!editText.trim() || editText === currentAnswer}
            className="ito-modal-btn-primary px-5 py-2"
          >
            変更する
          </button>
        </div>
      </div>
    </div>
  );
}
