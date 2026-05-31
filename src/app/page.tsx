"use client";

import { HostCreateRoom } from "@/components/features/TopPage/HostCreateRoom";
import { GuestJoinForm } from "@/components/features/TopPage/GuestJoinForm";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { UserSetupForm } from "@/components/features/TopPage/UserSetupForm";
import { useUserSetup } from "@/app/hooks/useUserSetup";
import { RulesModal } from "@/components/shared/RulesModal";
import { FooterLinks } from "@/components/shared/FooterLinks";
import { useAutoResume } from "@/app/hooks/useAutoResume";

export default function TopPage() {
  // useAutoResume();
  const { userName, setUserName, selectedIconId, setSelectedIconId } =
    useUserSetup();

  return (
    <AnimatedBackground>
      {/* 💡 右上のルール説明ボタン */}
      <div className="absolute top-4 right-4 z-50">
        <RulesModal />
      </div>

      {/* スクロールできるように py-10 などで上下の余白を取るとスマホでも綺麗です */}
      <div className="ito-narrow-container min-h-screen justify-center py-10">
        <h1 className="font-kei mb-10 text-4xl font-black tracking-[2px] text-black md:text-5xl">
          ナンバートーク
        </h1>

        <div className="flex w-full flex-col gap-6">
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

        {/* 💡 フッターリンク（GitHub / お問い合わせ） */}
        <FooterLinks />
      </div>
    </AnimatedBackground>
  );
}
