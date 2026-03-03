# next-blog-app

Next.js + Prisma + PostgreSQL + Supabase（Auth/Storage）で作ったブログアプリです。

## 主な機能

- 記事一覧 / 記事詳細
- カテゴリ管理（記事に複数カテゴリ付与）
- 管理画面（ログイン / 記事CRUD / カテゴリCRUD）
- カバー画像アップロード（Supabase Storage: `cover-image`）

## 技術

- Next.js（App Router） / React
- Prisma
- PostgreSQL
- Supabase（Auth / Storage）

## セットアップ

```bash
npm i
```

`.env.local` を作成して環境変数を設定します（`DIRECT_URL` と `DATABASE_URL` は同じでもOKです）。

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
```

DB反映（いずれか）:

```bash
npx prisma db push
# or
npx prisma migrate dev
```

初期データ投入（任意）:

```bash
npx prisma db seed
```

起動:

```bash
npm run dev
```

## メモ

- Supabase Storage に `cover-image` バケットを作成してください（プレビューURL生成に使用）。
- 認証は Supabase Auth を使用しています（`persistSession: false` のため、リロードでログインが切れます）。
