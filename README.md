# my_ito_app — Web版「ito」

リアルタイムで遊べるブラウザ向けのカードゲーム「ito」のWeb実装です。

## 特長

- リアルタイム同期（Supabase Realtime）で複数プレイヤーの状態を即時反映
- レスポンシブ対応でスマホ・PCどちらでも快適にプレイ可能
- ルームURLを共有して即時参加できる手軽さ
- 観戦モード対応（途中参加のプレイヤーは観戦→次ラウンドで参加）

## 技術スタック

- フロントエンド: Next.js (App Router), React, TypeScript
- スタイリング: Tailwind CSS
- BaaS / Realtime: Supabase (Postgres + Realtime)
- デプロイ: Vercel

## クイックスタート (ローカル開発)

1. リポジトリをクローン

```bash
git clone https://github.com/Latte39777/my_ito_app.git
cd my_ito_app
```

2. 依存をインストール

```bash
npm install
```

3. 環境変数を用意

ルートに `.env.local` を作り、Supabase の値を設定します:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## ディレクトリ概要

- `src/app/` — Next.js App Router 用ページコンポーネント
- `src/components/` — UI コンポーネント群
- `src/data/` — お題やアイコンなどの静的データ
- `src/hooks/` — カスタムフック（状態同期など）
- `src/lib/` — Supabase クライアント等のユーティリティ
- `src/services/` — ビジネスロジック（room / player / game など）
- `src/types/` — TypeScript 型定義

## 開発ワークフロー

- `main` — 本番用（Vercel に自動デプロイ）
- `develop` — 開発ブランチ、機能追加や修正はここから派生

## 貢献 / フィードバック

Issue や Pull Request、大歓迎です。バグ報告や改善提案は Issue を立ててください。

## ライセンス

このリポジトリのライセンス情報がプロジェクトに含まれていない場合は、必要に応じて `LICENSE` を追加してください。

---

必要なら「導入手順を詳しく」「スクリーンショット追加」「英語版作成」なども対応します。
