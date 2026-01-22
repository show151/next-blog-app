"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useAuth } from "@/app/_hooks/useAuth";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import CryptoJS from "crypto-js";

// ファイルのMD5ハッシュ値を計算する関数
const calculateMD5Hash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  return CryptoJS.MD5(wordArray).toString();
};

// カテゴリをフェッチしたときのレスポンスのデータ型
type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 投稿記事のカテゴリ選択用のデータ型
type SelectableCategory = {
  id: string;
  name: string;
  isSelect: boolean;
};

// 投稿記事の新規作成のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCoverImageKey, setNewCoverImageKey] = useState("");

  const router = useRouter();

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [checkableCategories, setCheckableCategories] = useState<
    SelectableCategory[] | null
  >(null);

  const { token } = useAuth(); // トークンの取得

  const coverPreviewUrl = newCoverImageKey
    ? supabase.storage.from("cover-image").getPublicUrl(newCoverImageKey).data.publicUrl
    : undefined;

  // コンポーネントがマウントされたとき (初回レンダリングのとき) に1回だけ実行
  useEffect(() => {
    // ウェブAPI (/api/categories) からカテゴリの一覧をフェッチする関数の定義
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        // フェッチ処理の本体
        const requestUrl = "/api/categories";
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        // レスポンスのステータスコードが200以外の場合 (カテゴリのフェッチに失敗した場合)
        if (!res.ok) {
          setCheckableCategories(null);
          throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
        }

        // レスポンスのボディをJSONとして読み取りカテゴリ配列 (State) にセット
        const apiResBody = (await res.json()) as CategoryApiResponse[];
        setCheckableCategories(
          apiResBody.map((body) => ({
            id: body.id,
            name: body.name,
            isSelect: false,
          })),
        );
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? `カテゴリの一覧のフェッチに失敗しました: ${error.message}`
            : `予期せぬエラーが発生しました ${error}`;
        console.error(errorMsg);
        setFetchErrorMsg(errorMsg);
      } finally {
        // 成功した場合も失敗した場合もローディング状態を解除
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // チェックボックスの状態 (State) を更新する関数
  const switchCategoryState = (categoryId: string) => {
    if (!checkableCategories) return;

    setCheckableCategories(
      checkableCategories.map((category) =>
        category.id === categoryId
          ? { ...category, isSelect: !category.isSelect }
          : category,
      ),
    );
  };

  const updateNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ここにタイトルのバリデーション処理を追加する
    setNewTitle(e.target.value);
  };

  const updateNewContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // ここに本文のバリデーション処理を追加する
    setNewContent(e.target.value);
  };

  const updateNewCoverImageKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ここにカバーイメージURLのバリデーション処理を追加する
    setNewCoverImageKey(e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const fileHash = await calculateMD5Hash(file);
      const path = `private/${fileHash}`;
      const { data, error } = await supabase.storage
        .from("cover-image")
        .upload(path, file, { upsert: true });

      if (error || !data) {
        window.alert(`アップロードに失敗: ${error?.message}`);
        return;
      }
      
      setNewCoverImageKey(data.path);
    } catch (error) {
      console.error(error);
      window.alert("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // この処理をしないとページがリロードされるので注意

    setIsSubmitting(true);

    // ▼▼ 追加 ウェブAPI (/api/admin/posts) にPOSTリクエストを送信する処理
    try {
      const requestBody = {
        title: newTitle,
        content: newContent,
        coverImageKey: newCoverImageKey,
        categoryIds: checkableCategories
          ? checkableCategories.filter((c) => c.isSelect).map((c) => c.id)
          : [],
      };
      const requestUrl = "/api/admin/posts";
      console.log(`${requestUrl} => ${JSON.stringify(requestBody, null, 2)}`);

      if (!token) {
        window.alert("予期せぬ動作：トークンが取得できません。");
        return;
      }

      const res = await fetch(requestUrl, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
      }

      const postResponse = await res.json();
      setIsSubmitting(false);
      router.push(`/posts/${postResponse.id}`); // 投稿記事の詳細ページに移動
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `投稿記事のPOSTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!checkableCategories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-2xl sm:text-3xl font-bold">投稿記事の新規作成</div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center rounded-lg bg-white px-6 sm:px-8 py-3 sm:py-4 shadow-lg">
            <FontAwesomeIcon
              icon={faSpinner}
              className="mr-2 animate-spin text-gray-500"
            />
            <div className="flex items-center text-gray-500 text-sm sm:text-base">処理中...</div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={twMerge("space-y-4 sm:space-y-5", isSubmitting && "opacity-50")}
      >
        <div className="space-y-1">
          <label htmlFor="title" className="block font-bold text-sm sm:text-base">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full rounded-md border-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base"
            value={newTitle}
            onChange={updateNewTitle}
            placeholder="タイトルを記入してください"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="content" className="block font-bold text-sm sm:text-base">
            本文
          </label>
          <textarea
            id="content"
            name="content"
            className="h-40 sm:h-48 w-full rounded-md border-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base"
            value={newContent}
            onChange={updateNewContent}
            placeholder="本文を記入してください"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="coverImageFile" className="block font-bold text-sm sm:text-base">
            カバー画像ファイル
          </label>
          <input
            type="file"
            id="coverImageFile"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className={twMerge(
              "w-full rounded-md border-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base",
              "file:rounded file:px-2 file:py-1",
              "file:bg-blue-500 file:text-white hover:file:bg-blue-600",
              "file:cursor-pointer",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          />
          {isUploading && (
            <p className="text-sm text-blue-600">
              <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
              アップロード中...
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="coverImageKey" className="block font-bold text-sm sm:text-base">
            カバーイメージキー
          </label>
          <input
            type="text"
            id="coverImageKey"
            name="coverImageKey"
            className="w-full rounded-md border-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base"
            value={newCoverImageKey}
            onChange={updateNewCoverImageKey}
            placeholder="例: cover-img-red.jpg"
            required
          />
          {coverPreviewUrl && (
            <div className="mt-2">
              <Image
                src={coverPreviewUrl}
                alt="カバー画像プレビュー"
                width={800}
                height={500}
                className="w-full h-48 object-cover rounded-md"
                unoptimized
              />
            </div>
          )}
        </div>
        <div className="space-y-1 sm:space-y-2">
          <div className="font-bold text-sm sm:text-base">タグ</div>
          <div className="flex flex-wrap gap-3 sm:gap-x-3.5 gap-y-2">
            {checkableCategories.length > 0 ? (
              checkableCategories.map((c) => (
                <label key={c.id} className="flex space-x-1 text-sm sm:text-base">
                  <input
                    id={c.id}
                    type="checkbox"
                    checked={c.isSelect}
                    className="mt-0.5 cursor-pointer"
                    onChange={() => switchCategoryState(c.id)}
                  />
                  <span className="cursor-pointer">{c.name}</span>
                </label>
              ))
            ) : (
              <div className="text-sm sm:text-base">選択可能なカテゴリが存在しません。</div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between pt-4">
          <Link
            href="/admin"
            className="flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-gray-400 px-4 py-2 text-white font-semibold hover:bg-gray-500 transition-colors text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            戻る
          </Link>
          <button
            type="submit"
            className={twMerge(
              "rounded-md px-5 py-2 font-bold text-sm sm:text-base",
              "bg-indigo-500 text-white hover:bg-indigo-600",
              "disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2",
            )}
            disabled={isSubmitting}
          >
            記事を投稿
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
