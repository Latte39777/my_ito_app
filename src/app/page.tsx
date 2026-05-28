"use client";

import { useState } from "react";
import { HostSection } from "@/components/HostSection";
import { GuestSection } from "@/components/GuestSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AVAILABLE_ICONS } from "@/components/iconList";
import { IconSelector } from "@/components/IconSelector";

export default function TopPage() {
  const [userName, setUserName] = useState("");
  const [selectedIconId, setSelectedIconId] = useState(AVAILABLE_ICONS[0].id);

  return (
    <AnimatedBackground>
      <div className="flex-1 flex flex-col items-center justify-center p-5 w-full max-w-[400px] mx-auto">
        <h1 className="font-kei text-4xl md:text-5xl font-black text-black mb-10 tracking-[2px]">
          ナンバートーク
        </h1>

        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">あなたの名前</label>

            {/* 💡 ここを修正：名前入力欄を先にして、アイコン選択を右に配置！ */}
            <div className="ito-box flex items-end gap-2 p-2">
              {/* 名前入力欄 */}
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="例：らて"
                maxLength={12}
                className="ito-input py-2 px-3 text-xl"
              />

              {/* アイコン選択ボタン（名前の右横） */}
              <div className="shrink-0 mb-1">
                <IconSelector
                  selectedIcon={selectedIconId}
                  onSelectIcon={setSelectedIconId}
                />
              </div>
            </div>
          </div>

          <HostSection userName={userName} iconId={selectedIconId} />
          <GuestSection userName={userName} iconId={selectedIconId} />
        </div>
      </div>
    </AnimatedBackground>
  );
}
