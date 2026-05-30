"use client";

import { HostCreateRoom } from "@/components/features/TopPage/HostCreateRoom";
import { GuestJoinForm } from "@/components/features/TopPage/GuestJoinForm";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { UserSetupForm } from "@/components/features/TopPage/UserSetupForm";
import { useUserSetup } from "@/app/hooks/useUserSetup";

export default function TopPage() {
  const { userName, setUserName, selectedIconId, setSelectedIconId } =
    useUserSetup();

  return (
    <AnimatedBackground>
      <div className="flex-1 flex flex-col items-center justify-center p-5 w-full max-w-[400px] mx-auto">
        <h1 className="font-kei text-4xl md:text-5xl font-black text-black mb-10 tracking-[2px]">
          ナンバートーク
        </h1>

        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">あなたの名前</label>

            <UserSetupForm
              userName={userName}
              setUserName={setUserName}
              iconId={selectedIconId}
              setIconId={setSelectedIconId}
            />
          </div>

          {/* ホスト（部屋作成）とゲスト（部屋参加）のセクション */}
          <HostCreateRoom userName={userName} iconId={selectedIconId} />
          <GuestJoinForm userName={userName} iconId={selectedIconId} />
        </div>
      </div>
    </AnimatedBackground>
  );
}
