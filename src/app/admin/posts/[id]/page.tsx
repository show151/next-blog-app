"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@/app/_types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type PostData = {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  categories: { category: { id: string; name: string } }[];
};

type PostCategory = { category: { id: string; name: string } };

const AdminPostEditPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [post, setPost] = useState<PostData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, categoriesRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch("/api/categories")
        ]);
        
        const postData = await postRes.json();
        const categoriesData = await categoriesRes.json();
        
        setPost(postData);
        setCategories(categoriesData);
        setTitle(postData.title);
        setContent(postData.content);
        setCoverImageURL(postData.coverImageURL);
        setSelectedCategoryIds(postData.categories.map((c: PostCategory) => c.category.id));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          coverImageURL,
          categoryIds: selectedCategoryIds
        })
      });
      if (response.ok) {
        alert("更新しました");
        router.push("/admin/posts");
      }
    } catch (error) {
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!confirm("この投稿を削除しますか？")) return;
    
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        alert("削除しました");
        router.push("/admin/posts");
      }
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-2xl sm:text-3xl font-bold">投稿編集</div>
      </div>
      
      <form className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border rounded px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">カバー画像URL</label>
          <input
            type="text"
            value={coverImageURL}
            onChange={(e) => setCoverImageURL(e.target.value)}
            className="w-full border rounded px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-2">カテゴリ</label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                    } else {
                      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id));
                    }
                  }}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Link
            href="/admin/posts"
            className="flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-gray-400 px-4 py-2 text-white font-semibold hover:bg-gray-500 transition-colors text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            戻る
          </Link>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base font-semibold"
            >
              更新
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base font-semibold"
            >
              削除
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default AdminPostEditPage;