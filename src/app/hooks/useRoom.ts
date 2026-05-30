// src/hooks/useRoom.ts
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Room, Player } from "@/types/schema";
import { endGame, startGame } from "@/services/gameService"; // 💡 startGameを追加
import { leaveRoom } from "@/services/playerService";

export function useRoom(roomCode: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayerId, setMyPlayerId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // 💡 追加：アクション（開始・退出）の処理中状態
  const [isActionLoading, setIsActionLoading] = useState(false);

  // 初期データの取得と参加処理
  useEffect(() => {
    if (!roomCode) return;

    const initRoom = async () => {
      try {
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("room_code", roomCode)
          .single();

        if (roomError || !roomData) throw new Error("部屋が見つかりません");

        setRoom(roomData);
        const currentPlayers: Player[] = roomData.players || [];
        setPlayers(currentPlayers);

        const joinName = searchParams.get("name");
        const joinIcon = searchParams.get("icon");
        const joinHostId = searchParams.get("hostId");
        const savedPlayerId = localStorage.getItem(`ito_player_${roomCode}`);

        const isPlayerInDB = currentPlayers.some((p) => p.id === savedPlayerId);

        let validPlayerId = savedPlayerId;
        if (savedPlayerId && !isPlayerInDB) {
          localStorage.removeItem(`ito_player_${roomCode}`);
          validPlayerId = null;
        }

        if (validPlayerId) {
          setMyPlayerId(validPlayerId);
          if (joinName || joinIcon) router.replace(`/room/${roomCode}`);
        } else if (joinHostId) {
          setMyPlayerId(joinHostId);
          localStorage.setItem(`ito_player_${roomCode}`, joinHostId);
          router.replace(`/room/${roomCode}`);
        } else if (joinName && joinIcon) {
          const newPlayerId = crypto.randomUUID();
          const isPlaying = roomData.status === "playing";

          const newPlayer: Player = {
            id: newPlayerId,
            name: joinName,
            icon: joinIcon,
            isHost: false,
            card: null,
            answerText: "",
            isCardOpen: false,
            isOnline: true,
            isSpectating: isPlaying,
          };

          const updatedPlayers = [...currentPlayers, newPlayer];
          await supabase
            .from("rooms")
            .update({ players: updatedPlayers })
            .eq("room_code", roomCode);

          setMyPlayerId(newPlayerId);
          localStorage.setItem(`ito_player_${roomCode}`, newPlayerId);
          router.replace(`/room/${roomCode}`);
        } else {
          alert("名前を入力して参加してね！");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        alert("エラーが発生しました。");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    initRoom();
  }, [roomCode, searchParams, router]);

  // Supabase リアルタイム購読
  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase
      .channel(`room_${roomCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            alert("ホストがルームを解散しました。");
            localStorage.removeItem(`ito_player_${roomCode}`);
            router.push("/");
            return;
          }

          if (payload.eventType === "UPDATE") {
            const updatedRoom = payload.new as Room;
            setRoom(updatedRoom);
            setPlayers(updatedRoom.players || []);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, router]);

  // 💡 ゲーム開始ロジック
  const handleStartGame = async () => {
    if (!room || isActionLoading) return;
    setIsActionLoading(true);
    try {
      await startGame(room.room_code);
    } catch (error) {
      console.error(error);
      alert("ゲームの開始に失敗しました。");
    } finally {
      setIsActionLoading(false);
    }
  };

  // 💡 退出・解散ロジック
  const handleQuitRoom = async () => {
    if (!room || isActionLoading) return;

    const isHost = players.find((p) => p.id === myPlayerId)?.isHost;
    const confirmMessage = isHost
      ? "ルームを解散しますか？"
      : "ルームから退出しますか？";

    if (!confirm(confirmMessage)) return;

    setIsActionLoading(true);
    try {
      if (isHost) {
        await endGame(room.room_code);
      } else {
        await leaveRoom(room.room_code, myPlayerId);
      }
      localStorage.removeItem(`ito_player_${roomCode}`);
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("退出に失敗しました");
      setIsActionLoading(false);
    }
  };

  return {
    room,
    players,
    myPlayerId,
    loading,
    isActionLoading,
    handleStartGame,
    handleQuitRoom,
  };
}
