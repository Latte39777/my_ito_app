"use client";

import { useState } from "react";
import { changePlayerName } from "@/services/playerService";

interface SettingsButtonProps {
  roomCode: string;
  myPlayerId: string;
  currentName: string;
}

export function SettingsButton({
  roomCode,
  myPlayerId,
  currentName,
}: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editName.trim() || editName === currentName) {
      setIsOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      await changePlayerName(roomCode, myPlayerId, editName.trim());
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("名前の変更に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* 画面右上に固定される歯車ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-gray-100 transition-colors z-50 shadow-sm"
        aria-label="設定"
      >
        ⚙️
      </button>

      {/* モーダル背景と中身 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm flex flex-col gap-5 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-black text-black border-b-2 border-gray-100 pb-2">
              設定
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-500">
                名前の変更
              </label>
              <input
                type="text"
                maxLength={12}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xl font-bold text-black border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="新しい名前"
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="px-5 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editName.trim()}
                className="px-5 py-2 font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 transition-colors"
              >
                {isSaving ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
