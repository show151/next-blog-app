"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faExclamationTriangle, faNewspaper, faCog, faFire, faArrowRight, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/_hooks/useAuth";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { session, isLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await fetch("/api/posts", { method: "GET", cache: "no-store" });
        
        if (!postsRes.ok) throw new Error("データの取得に失敗しました");
        
        const postsData = await postsRes.json();
        setPosts(postsData);
        setPopularPosts(postsData.slice(0, 3)); // 仮の人気記事
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      }
    };
    fetchData();
  }, []);

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="text-4xl text-red-500 mb-4" 
          />
          <p className="text-lg text-red-600 font-medium">{fetchError}</p>
          <p className="text-sm text-slate-500 mt-2">ページを再読み込みしてください</p>
        </div>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="text-4xl text-blue-500 mb-4 animate-spin" 
          />
          <p className="text-lg text-slate-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="py-6 px-4 max-w-6xl mx-auto">
      {/* ヒーローセクション */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <FontAwesomeIcon 
              icon={faHeart} 
              className="text-4xl sm:text-5xl text-pink-600" 
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Show's Life Blog</h1>
              <p className="text-base sm:text-lg text-slate-600">人生の旅路での学びと気づき</p>
            </div>
          </div>
          {!isLoading && session && (
            <Link 
              href="/admin" 
              className="flex items-center justify-center sm:justify-start px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              <span className="text-sm font-medium">管理者</span>
            </Link>
          )}
        </div>
        
        {/* サイト概要 */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-pink-200 mb-8"> {/* eslint-disable-line */}
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">このブログについて</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
            日々の生活での小さな発見、人生の転機、成長の瞬間、大切な人との出会いなど、
            人生を豊かにする様々な経験や思いをシェアしています。
            同じように人生を歩んでいる皆さんと、一緒に成長していけたらと思います。
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs sm:text-sm font-medium">人生論</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">成長</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs sm:text-sm font-medium">日常</span>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs sm:text-sm font-medium">気づき</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* 新着記事 */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center">
              <FontAwesomeIcon icon={faNewspaper} className="mr-3 text-blue-600" />
              新着記事
            </h2>
            <Link 
              href="/posts" 
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors w-fit"
            >
              すべて見る
              <FontAwesomeIcon icon={faArrowRight} className="ml-1 text-xs" />
            </Link>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-slate-400 mb-4" />
              <p className="text-slate-600">まだ投稿がありません</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.slice(0, 1).map((post) => (
                <PostSummary key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* 人気記事 */}
        {popularPosts.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faFire} className="mr-3 text-orange-500" />
              おすすめ記事
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {popularPosts.map((post, index) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border-l-4 border-orange-400">
                  <div className="flex items-start space-x-3 gap-2 sm:gap-3">
                    <span className="shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
                        <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-2">{post.title}</h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Page;
