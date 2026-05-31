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
        className="ito-box flex h-10 w-10 items-center justify-center text-xl transition-transform"
        aria-label="設定"
      >
        <TbSettingsFilled size={24} className="text-gray-700" />
      </button>

      {/* モーダル背景と中身 */}
      {isOpen && (
        <div className="ito-modal-backdrop" onClick={handleBackdropClick}>
          <div
            className="ito-modal-card max-w-sm gap-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="ito-modal-title">設定</h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-500">
                名前の変更
              </label>
              <input
                type="text"
                maxLength={12}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="ito-modal-input p-3 text-xl"
                placeholder="新しい名前"
              />
            </div>

            <div className="mt-2 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="ito-modal-btn-secondary px-5 py-2"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editName.trim()}
                className="ito-modal-btn-primary px-5 py-2"
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
