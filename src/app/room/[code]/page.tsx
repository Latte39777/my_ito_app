"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Room, Player } from "@/types/schema";
import { WaitingRoom } from "@/components/WaitingRoom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PlayingRoom } from "@/components/PlayingRoom";
import { endGame, startGame } from "@/services/gameService";
import { leaveRoom } from "@/services/playerService";

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomCode = params.code as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayerId, setMyPlayerId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // 1. 初期データの取得と参加処理
  useEffect(() => {
    if (!roomCode) return;

    const initRoom = async () => {
      try {
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("room_code", roomCode)
          .single();

        if (roomError || !roomData) {
          throw new Error("部屋が見つかりません");
        }

        setRoom(roomData);
        const currentPlayers: Player[] = roomData.players || [];
        setPlayers(currentPlayers);

        const joinName = searchParams.get("name");
        const joinIcon = searchParams.get("icon");
        const joinHostId = searchParams.get("hostId");
        const savedPlayerId = localStorage.getItem(`ito_player_${roomCode}`);

        if (savedPlayerId) {
          setMyPlayerId(savedPlayerId);
        } else if (joinHostId) {
          setMyPlayerId(joinHostId);
          localStorage.setItem(`ito_player_${roomCode}`, joinHostId);
          router.replace(`/room/${roomCode}`);
        } else if (joinName && joinIcon) {
          const newPlayerId = crypto.randomUUID();

          // 💡 途中参加判定：ゲーム中なら観戦者にする
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
            isSpectating: isPlaying, // ここで判定
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

  // 2. Supabase リアルタイム購読
  // RoomPage.tsx の 2. Supabase リアルタイム購読 useEffect 内

  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase
      .channel(`room_${roomCode}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          const updatedRoom = payload.new as Room;

          // 💡 ここに追加！
          // ホストがゲームを終了（waitingに戻した）時に、参加者全員をホームへ戻す
          if (updatedRoom.status === "waiting" && room?.status === "playing") {
            alert("ホストがゲームを終了しました。");
            localStorage.removeItem(`ito_player_${roomCode}`); // ストレージも掃除
            router.push("/");
          }

          setRoom(updatedRoom);
          setPlayers(updatedRoom.players || []);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, room?.status, router]); // 💡 [roomCode] に [room?.status, router] を追加しておくと安全です

  const handleStartGame = async () => {
    if (!room) return;
    try {
      await startGame(room);
    } catch (error) {
      console.error(error);
      alert("ゲームの開始に失敗しました。");
    }
  };

  const handleQuitRoom = async () => {
    if (!room) return;
    const isHost = players.find((p) => p.id === myPlayerId)?.isHost;

    if (
      !confirm(isHost ? "ルームを解散しますか？" : "ルームから退出しますか？")
    )
      return;

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
    }
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="flex-1 flex items-center justify-center font-bold text-black">
          読み込み中...
        </div>
      </AnimatedBackground>
    );
  }

  if (!room) return null;

  const myPlayer = players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost || false;

  return (
    <AnimatedBackground>
      {room.status === "waiting" && (
        <WaitingRoom
          room={room}
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost}
          onStartGame={handleStartGame}
          onDisbandRoom={handleQuitRoom}
        />
      )}

      {room.status === "playing" && myPlayer && (
        <PlayingRoom
          room={room}
          players={players}
          myPlayer={myPlayer}
          isHost={isHost}
        />
      )}
    </AnimatedBackground>
  );
}
