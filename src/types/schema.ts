import { z } from "zod";

// 1. お題のスキーマ
export const themeSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z
    .string()
    .min(1, "お題を入力してください")
    .max(30, "お題は30文字以内です"),
  low: z
    .string()
    .min(1, "1側の基準を入力してください")
    .max(15, "15文字以内です"),
  high: z
    .string()
    .min(1, "100側の基準を入力してください")
    .max(15, "15文字以内です"),
});

// 2. プレイヤー1人分のスキーマ
export const playerSchema = z.object({
  id: z.uuid({ message: "IDが不正です" }),
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(12, "名前は12文字以内です"),
  icon: z.string(), // アイコン
  isHost: z.boolean(), // ホストかどうかを管理するフィールド
  card: z.number().int().min(1).max(100).nullable(), // カードは1〜100の整数、最初はnull
  answerText: z.string().max(25, "例えは25文字以内で入力してください"), // 文字数制限
  isCardOpen: z.boolean(), // カードが公開されているかどうかを管理するフィールド
  isOnline: z.boolean(), // オンライン状態を管理するフィールド
  isSpectating: z.boolean(), // 観戦モードかどうかを管理するフィールド
});

// 3. 部屋全体のスキーマ
export const roomSchema = z.object({
  room_code: z.string().length(4), // 部屋コードは絶対に4桁
  status: z.enum(["waiting", "playing"]), // statusはこの2つの文字しか許さない
  current_theme: themeSchema.nullable(), // お題は最初nullで、ゲーム開始と同時にテーマが入る
  life: z.number().int().min(-99).max(99), // ライフは-99〜99の整数
  players: z.array(playerSchema), // プレイヤーの配列
  deck: z.array(z.number().int().min(1).max(100)), // 1〜100の山札配列
  round_started_at: z.number().int().nullable(), // ラウンド開始時刻のタイムスタンプ（ミリ秒）。nullならラウンド開始前。
  created_at: z.string().optional(), // Supabaseの自動生成フィールド（挿入時は不要）
});

// Zodのスキーマから、TypeScript用の「型」を自動で抽出してエクスポート
export type Theme = z.infer<typeof themeSchema>;
export type Player = z.infer<typeof playerSchema>;
export type Room = z.infer<typeof roomSchema>;
