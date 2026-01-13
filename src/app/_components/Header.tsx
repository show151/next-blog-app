"use client";
import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase"; // ◀ 追加
import { useAuth } from "@/app/_hooks/useAuth"; // ◀ 追加
import { useRouter } from "next/navigation"; // ◀ 追加

const Header: React.FC = () => {
  // ▼ 追加
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/");
    setIsLoggingOut(false);
  };
  // ▲ 追加

  return (
    <header>
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <div
          className={twMerge(
            "py-6 px-4 max-w-6xl mx-auto",
            "flex items-center justify-between",
            "text-sm md:text-lg font-bold text-white",
          )}
        >
          <div>
            <Link href="/" className="hover:text-pink-100 transition-colors flex items-center">
              <FontAwesomeIcon icon={faFish} className="mr-1 md:mr-2 text-pink-200 text-lg md:text-xl" />
              <span className="hidden sm:inline">Show's Life Blog</span>
            </Link>
          </div>
          <div className="flex gap-x-2 md:gap-x-6 text-xs md:text-base">
            {!isLoading &&
              (session ? (
                <button 
                  onClick={logout} 
                  disabled={isLoggingOut}
                  className="hover:text-pink-100 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              ) : (
                <Link href="/login" className="hover:text-pink-100 transition-colors">Login</Link>
              ))}
            <Link href="/posts" className="hover:text-pink-100 transition-colors">Posts</Link>
            <Link href="/about" className="hover:text-pink-100 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
