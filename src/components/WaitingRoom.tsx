"use client";

import { RoomSchema, Player } from "@/types/schema";

interface WaitingRoomProps {
  room: RoomSchema;
  isHost: boolean;
  onStartGame: () => void;
}

export default function WaitingRoom({
  room,
  isHost,
  onStartGame,
}: WaitingRoomProps) {
  return (
    <div>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          ルームコード
        </p>
        <h1
          style={{
            fontSize: "48px",
            letterSpacing: "4px",
            margin: "10px 0",
            color: "#0070f3",
          }}
        >
          {room.room_code}
        </h1>
        <p style={{ fontSize: "14px", color: "#999" }}>
          友達にこの4桁のコードを教えてね！
        </p>
      </header>

      {/* お題のチラ見せ */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>🎲 今回のお題テーマ</h3>
        <p
          style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 5px 0" }}
        >
          {room.current_theme?.title}
        </p>
        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
          （1：{room.current_theme?.low} 〜 100：{room.current_theme?.high}）
        </p>
      </section>

      {/* 参加者一覧リスト */}
      <section style={{ marginBottom: "30px" }}>
        <h3 style={{ borderBottom: "2px solid #222", paddingBottom: "8px" }}>
          参加中のプレイヤー ({room.players.length}人)
        </h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {room.players.map((player: Player) => (
            <li
              key={player.id}
              style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {player.name} {player.isHost && "👑 (ホスト)"}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: player.isSpectating ? "#999" : "#0070f3",
                }}
              >
                {player.isSpectating ? "観戦中" : "参戦モード"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 操作ボタン */}
      <footer style={{ marginTop: "40px" }}>
        {isHost ? (
          <button
            onClick={onStartGame}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "18px",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            全員揃ったのでゲームを開始する 🚀
          </button>
        ) : (
          <div
            style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}
          >
            ホストがゲームを開始するのを待っています...⏳
          </div>
        )}
      </footer>
    </div>
  );
}
