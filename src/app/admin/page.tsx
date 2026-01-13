"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFileText, faPlus, faList, faFolderPlus } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const adminLinks = [
    {
      href: "/admin/posts",
      title: "投稿管理",
      description: "ブログ投稿の一覧・編集・削除",
      icon: faFileText,
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:from-blue-100 hover:to-blue-200"
    },
    {
      href: "/admin/posts/new",
      title: "新規投稿",
      description: "新しいブログ投稿を作成",
      icon: faPlus,
      color: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:from-purple-100 hover:to-purple-200"
    },
    {
      href: "/admin/categories",
      title: "カテゴリ管理",
      description: "カテゴリの一覧・編集・削除",
      icon: faList,
      color: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 hover:from-slate-100 hover:to-slate-200"
    },
    {
      href: "/admin/categories/new",
      title: "新規カテゴリ",
      description: "新しいカテゴリを作成",
      icon: faFolderPlus,
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-300 hover:from-indigo-100 hover:to-indigo-200"
    }
  ];

  return (
    <main className="px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">管理者ダッシュボード</h1>
        <p className="text-sm sm:text-base text-slate-600">ブログの管理機能にアクセスできます</p>
      </div>
      
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block p-4 sm:p-6 rounded-lg border-2 transition-all duration-200 ${link.color}`}
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="shrink-0">
                <FontAwesomeIcon 
                  icon={link.icon} 
                  className="text-xl sm:text-2xl text-slate-700" 
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
                  {link.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-2">
                  {link.description}
                </p>
                <div className="flex items-center text-xs sm:text-sm text-blue-600">
                  <span className="mr-1">アクセス</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Page;
