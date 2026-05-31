import { z } from "zod";

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

export const playerSchema = z.object({
  id: z.uuid({ message: "IDが不正です" }),
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(12, "名前は12文字以内です"),
  icon: z.string(), 
  isHost: z.boolean(), 
  card: z.number().int().min(1).max(100).nullable(), 
  answerText: z.string().max(30, "例えは30文字以内で入力してください"), 
  isCardOpen: z.boolean(), 
  isOnline: z.boolean(), 
  isSpectating: z.boolean(), 
});

export const roomSchema = z.object({
  room_code: z.string().length(4), 
  round_number: z.number().default(1), 
  status: z.enum(["waiting", "playing"]), 
  current_theme: themeSchema.nullable(), 
  life: z.number().int().min(-99).max(99), 
  players: z.array(playerSchema), 
  deck: z.array(z.number().int().min(1).max(100)), 
  round_started_at: z.number().int().nullable(), 
  created_at: z.string().optional(), 
});

export type Theme = z.infer<typeof themeSchema>;
export type Player = z.infer<typeof playerSchema>;
export type Room = z.infer<typeof roomSchema>;
