import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAutoResume() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/room/")) return;

    const activeRoomKey = Object.keys(localStorage).find((key) =>
      key.startsWith("ito_player_"),
    );
    if (activeRoomKey) {
      const roomCode = activeRoomKey.replace("ito_player_", "");
      router.push(`/room/${roomCode}`);
    }
  }, [router, pathname]);
}
