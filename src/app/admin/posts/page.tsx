"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faEdit, faTrash, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase";
import Image from "next/image";

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("投稿記事の取得に失敗しました");
        }
        const data = await response.json();
        setPosts(data as Post[]);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("この投稿を削除しますか？")) return;
    
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      setPosts(posts?.filter(post => post.id !== id) || null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70">
        <div className="flex items-center space-x-3 text-slate-600">
          <span className="inline-block h-6 w-6 rounded-full border-4 border-slate-300 border-t-indigo-500 animate-spin" />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-2xl sm:text-3xl font-bold">投稿管理</div>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto"
        >
          <FontAwesomeIcon icon={faPlus} />
          新規投稿
        </Link>
      </div>
      <div className="space-y-2 sm:space-y-3 mb-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 shadow-sm hover:shadow-md gap-3 sm:gap-0"
          >
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {post.coverImageKey && (
                <div className="w-20 h-14 relative flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={supabase.storage.from("cover-image").getPublicUrl(post.coverImageKey).data.publicUrl}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{post.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <Link
                href={`/admin/posts/${post.id}`}
                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/admin"
        className="flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 text-white font-semibold hover:bg-gray-500 transition-colors w-full sm:w-fit justify-center sm:justify-start"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        戻る
      </Link>
    </main>
  );
};

export default AdminPostsPage;