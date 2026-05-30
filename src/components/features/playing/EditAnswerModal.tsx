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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className="animate-fade-in flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="border-b-2 border-gray-100 pb-2 text-2xl font-black text-black">
          回答の変更
        </h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            maxLength={30}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 p-3 text-xl font-bold text-black transition-colors focus:border-blue-500 focus:outline-none"
            placeholder="新しい回答"
          />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2 font-bold text-gray-500 transition-colors hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!editText.trim() || editText === currentAnswer}
            className="rounded-lg bg-blue-500 px-5 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            変更する
          </button>
        </div>
      </div>
    </div>
  );
}
