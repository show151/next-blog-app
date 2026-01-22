import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 初期セッションの取得
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setToken(session?.access_token || null);
        setIsLoading(false);
      } catch (error) {
        console.error(
          `セッションの取得に失敗しました。\n${JSON.stringify(error, null, 2)}`,
        );
        setIsLoading(false);
      }
    };
    initAuth();

    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setToken(session?.access_token || null);
      },
    );

    // タブを閉じる/離脱するときにログアウト（永続化なしでも明示的にサインアウト）
    const handlePageHide = async () => {
      try {
        await supabase.auth.signOut();
        setSession(null);
        setToken(null);
      } catch (err) {
        console.error("signOut on pagehide failed", err);
      }
    };

    // visibilitychange で非表示になったときもログアウトを試行
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handlePageHide();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", handlePageHide);
      document.addEventListener("visibilitychange", handleVisibility);
    }

    // アンマウント時に監視を解除（クリーンアップ）
    return () => {
      authListener?.subscription?.unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("pagehide", handlePageHide);
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
  }, []);

  return { isLoading, session, token };
};
