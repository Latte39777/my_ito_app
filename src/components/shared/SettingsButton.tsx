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

  const handleBackdropClick = () => {
    if (isSaving) return;
    setIsOpen(false);
  };

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
        className="ito-box flex h-8 w-8 items-center justify-center text-xl transition-transform md:h-10 md:w-10"
        aria-label="設定"
      >
        <TbSettingsFilled size={24} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="ito-modal-backdrop px-4" onClick={handleBackdropClick}>
          <div
            className="ito-modal-card flex w-full max-w-sm flex-col gap-4 p-5 md:gap-5 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="ito-modal-title text-lg md:text-xl">設定</h2>

            <div className="flex flex-col gap-1.5 md:gap-2">
              <label className="text-xs font-bold text-gray-500 md:text-sm">
                名前の変更
              </label>
              <input
                type="text"
                maxLength={12}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="ito-modal-input p-2.5 text-base md:p-3 md:text-xl"
                placeholder="新しい名前"
              />
            </div>

            <div className="mt-2 flex w-full gap-2 md:mt-4 md:justify-end md:gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="ito-modal-btn-secondary flex-1 px-4 py-2.5 text-sm md:flex-none md:px-5 md:py-2 md:text-base"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editName.trim()}
                className="ito-modal-btn-primary flex-1 px-4 py-2.5 text-sm md:flex-none md:px-5 md:py-2 md:text-base"
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
