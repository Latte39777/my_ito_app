"use client";

import { useState } from "react";
import { changePlayerName } from "@/services/playerService";
import { TbSettingsFilled } from "react-icons/tb";

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
      <button
        onClick={() => setIsOpen(true)}
        className="ito-box absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95"
        aria-label="設定"
      >
        <TbSettingsFilled size={22} className="text-gray-700" />
      </button>

      {/* モーダル背景と中身 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="animate-fade-in flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="border-b-2 border-gray-100 pb-2 text-2xl font-black text-black">
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
                className="w-full rounded-lg border-2 border-gray-200 p-3 text-xl font-bold text-black transition-colors focus:border-blue-500 focus:outline-none"
                placeholder="新しい名前"
              />
            </div>

            <div className="mt-2 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="rounded-lg px-5 py-2 font-bold text-gray-500 transition-colors hover:bg-gray-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editName.trim()}
                className="rounded-lg bg-blue-500 px-5 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
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
