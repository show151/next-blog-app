"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

import DOMPurify from "isomorphic-dompurify";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("投稿記事の取得に失敗しました");
        }
        const data = await response.json();
        setPost(data);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // エラーが発生した場合
  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  // カバー画像の公開URLを生成（キーのみ保持しているため）
  const coverImageUrl = post.coverImageKey
    ? supabase.storage.from("cover-image").getPublicUrl(post.coverImageKey).data.publicUrl
    : undefined;

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{post.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="mr-2" />
              {new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </div>
            
            {post.categories && post.categories.length > 0 && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                <div className="flex gap-2 flex-wrap">
                  {post.categories.map((postCategory, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {postCategory.category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
        
        {post.coverImageKey && coverImageUrl && (
          <div className="mb-6">
            <Image
              src={coverImageUrl}
              alt={post.title}
              width={800}
              height={600}
              unoptimized
              className="rounded-xl w-full h-auto"
            />
          </div>
        )}
        
        <div 
          className="prose prose-slate max-w-none leading-relaxed text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: safeHTML }} 
        />
      </article>
    </main>
  );
};

export default Page;
