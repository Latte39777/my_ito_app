import { useState } from "react";

interface RoomInfoAndShareProps {
  roomCode: string;
}

export function RoomInfoAndShare({ roomCode }: RoomInfoAndShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました", err);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-black mb-6">
        ルームID : {roomCode}
      </h2>

      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 text-center text-sm font-bold text-black overflow-hidden text-ellipsis whitespace-nowrap">
          {typeof window !== "undefined" ? window.location.href : "https://..."}
        </div>

        <button onClick={handleCopyUrl} className="ito-btn ito-btn-dark w-full">
          {copied ? "コピーしました！" : "URLをコピー"}
        </button>
      </div>
    </>
  );
}
