"use client";

import { TbBrandGithubFilled, TbMessageCircleQuestion } from "react-icons/tb";

export function FooterLinks() {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 text-sm font-bold text-black">
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfirAl6aWEsnaOoo2AFaYjSuFFgUYDYMkdMIq8W8bvoZg0X3w/viewform?usp=publish-editor" // 💡 ここにGoogleフォームのURLを入れる
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 transition-colors hover:text-white"
      >
        <TbMessageCircleQuestion size={18} />
        バグ報告・お題のリクエスト
      </a>

      <a
        href="https://github.com/Latte39777/my_ito_app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 transition-colors hover:text-white"
      >
        <TbBrandGithubFilled size={18} />
        GitHub
      </a>

      <span className="mt-2 text-xs font-bold font-normal text-black">
        © {new Date().getFullYear()} ナンバートーク
      </span>
    </div>
  );
}
