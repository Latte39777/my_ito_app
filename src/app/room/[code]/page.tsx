"use client";

import { useState } from "react";
import { RoomSchema, Player } from "@/types/schema";
import { submitMyAnswer, openMyCard } from "@/services/playerService";
import {
  updateRoomLife,
  advanceToNextRound,
  changeOnlyTheme,
} from "@/services/gameService";
import themesData from "@/data/themes.json"; // ★JSONをインポート

interface GameBoardProps {
  room: RoomSchema;
  myId: string;
  myData: Player | undefined;
  isHost: boolean;
  roomCode: string;
}

export default function GameBoard({
  room,
  myId,
  myData,
  isHost,
  roomCode,
}: GameBoardProps) {
  const [answerInput, setAnswerInput] = useState("");

  // 1. 自分の例え言葉を送信
  const handleAnswerSubmit = async () => {
    if (!answerInput.trim()) return;
    try {
      await submitMyAnswer(room, myId, answerInput.trim());
      alert("例えを送信しました！");
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ★追加：回答を書き換える（空文字を送信してリセット）
  const handleAnswerReset = async () => {
    try {
      await submitMyAnswer(room, myId, "");
      setAnswerInput(""); // 入力欄を空に戻す
    } catch (e: any) {
      alert(`回答のリセットに失敗しました: ${e.message}`);
    }
  };

  // 2. 自分のカードをオープン
  const handleCardOpen = async () => {
    if (!myData || myData.isCardOpen) return;
    if (!confirm("本当にカードをオープンしますか？")) return;
    try {
      await openMyCard(room, myId);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 3. ライフを減らす（ホストのみ）
  const handleDamage = async () => {
    try {
      await updateRoomLife(roomCode, room.life - 1);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ★修正：お題を引き直す（現在の手札や進捗を維持したまま、お題だけランダムに変更）
  const handleThemeChange = async () => {
    if (!confirm("お題を変更しますか？（現在の例えはリセットされません）"))
      return;
    try {
      const randomTheme =
        themesData[Math.floor(Math.random() * themesData.length)];
      // ⭕ 修正：changeOnlyTheme を使う！
      await changeOnlyTheme(room, randomTheme);
    } catch (e: any) {
      alert(`お題の変更に失敗しました: ${e.message}`);
    }
  };

  // 4. 次のラウンドへ進む（ホストのみ・完全にリフレッシュして配り直す）
  const handleNextRound = async () => {
    try {
      // 次のラウンド用にもランダムにお題をチョイス
      const nextTheme =
        themesData[Math.floor(Math.random() * themesData.length)];
      await advanceToNextRound(room, nextTheme);
      setAnswerInput("");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      {/* ライフと状態のヘッダー */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <span style={{ fontSize: "14px", color: "#666" }}>
            ルーム: {roomCode}
          </span>
        </div>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff4d4f" }}>
          {/* room?.life にすることで、万が一データが一瞬消えてもクラッシュしなくなるよ */}
          ❤️ ライフ: {room?.life ?? 3}
          {room?.life <= 0 && " 💀 GAME OVER"}
        </div>
      </header>

      {/* お題ボード */}
      <section
        style={{
          background: "#222",
          color: "#fff",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#aaa" }}>
          ▼ 今週のお題テーマ ▼
        </span>
        <h2
          style={{
            margin: "10px 0 15px 0",
            fontSize: "24px",
            color: "#ffd700",
          }}
        >
          {room?.current_theme?.title ?? "お題を設定中..."}
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            borderTop: "1px solid #444",
            paddingTop: "10px",
          }}
        >
          <span style={{ color: "#91d5ff" }}>
            【1】{room?.current_theme?.low ?? "???"}
          </span>
          <span style={{ color: "#ffa39e" }}>
            【100】{room?.current_theme?.high ?? "???"}
          </span>
        </div>
      </section>

      {/* 自分の秘密のカード */}
      <section
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "15px",
          background: "#f9f9f9",
          borderRadius: "8px",
          border: "1px solid #eee",
        }}
      >
        <h3>あなたの手札</h3>
        {myData ? (
          <div
            style={{
              display: "inline-block",
              width: "100px",
              height: "140px",
              background: myData.isCardOpen ? "#fff" : "#1890ff",
              color: myData.isCardOpen ? "#111" : "#fff",
              border: "3px solid #1890ff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                lineHeight: "140px",
              }}
            >
              {myData.card ?? "？"}
            </div>
          </div>
        ) : (
          <p style={{ color: "#999" }}>観戦中</p>
        )}

        {myData && !myData.isSpectating && (
          <div style={{ marginTop: "15px" }}>
            {!myData.answerText ? (
              // まだ回答していない時
              <>
                <input
                  type="text"
                  placeholder="お題に沿った例え言葉を入力"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  style={{ width: "70%", padding: "8px", fontSize: "14px" }}
                />
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!answerInput.trim()}
                  style={{
                    padding: "8px 12px",
                    marginLeft: "5px",
                    background: "#52c41a",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  送信
                </button>
              </>
            ) : (
              // すでに回答を送信している時（やり直しボタンを表示）
              <div
                style={{ fontSize: "14px", color: "#52c41a", marginTop: "5px" }}
              >
                <span>送信済み: 「{myData.answerText}」</span>
                <button
                  onClick={handleAnswerReset}
                  style={{
                    marginLeft: "10px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    background: "#f0f0f0",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    borderRadius: "4px",
                    color: "#333",
                  }}
                >
                  回答をやり直す ✏️
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 全員の状況 */}
      <section>
        <h3 style={{ borderBottom: "2px solid #333", paddingBottom: "5px" }}>
          アリーナ（全員の例えリスト）
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {room?.players?.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <div>
                <strong style={{ fontSize: "16px" }}>{p.name}</strong>
                <div
                  style={{ color: "#555", fontSize: "14px", marginTop: "4px" }}
                >
                  💬{" "}
                  {p.answerText ? (
                    `「${p.answerText}」`
                  ) : (
                    <span style={{ color: "#aaa", fontStyle: "italic" }}>
                      考え中...
                    </span>
                  )}
                </div>
              </div>
              <div>
                {p.isCardOpen ? (
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#ff4d4f",
                      border: "2px solid #ff4d4f",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {p.card}
                  </span>
                ) : (
                  <button
                    onClick={handleCardOpen}
                    disabled={p.id !== myId || !p.answerText}
                    style={{
                      padding: "6px 12px",
                      background:
                        p.id === myId && p.answerText ? "#1890ff" : "#fff",
                      color: p.id === myId && p.answerText ? "#fff" : "#ccc",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor:
                        p.id === myId && p.answerText
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {p.id === myId ? "めくる" : "潜伏中"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ホスト用マネジメントエリア */}
      {isHost && (
        <section
          style={{
            marginTop: "40px",
            padding: "15px",
            border: "2px dashed #ff4d4f",
            borderRadius: "8px",
            background: "#fff1f0",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#ff4d4f" }}>
            👑 ホスト専用コントロール
          </h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleDamage}
              style={{
                padding: "8px 12px",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              💥 順番を間違えた（ライフ -1）
            </button>

            {/* ★ここにお題チェンジボタンを実装！ */}
            <button
              onClick={handleThemeChange}
              style={{
                padding: "8px 12px",
                background: "#faad14",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              🎲 お題チェンジ
            </button>

            <button
              onClick={handleNextRound}
              style={{
                padding: "8px 12px",
                background: "#1890ff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              🔄 次のラウンドへ進む
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
