import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // セッションをローカルに永続化しない（リロードやタブを閉じるとログアウト状態）
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
