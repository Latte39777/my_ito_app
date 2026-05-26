import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が正しく設定されているか確認
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabaseの環境変数が設定されていません。プロジェクトのルートにある .env.local ファイルを確認してください。",
  );
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
