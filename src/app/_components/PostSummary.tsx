"use client";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });
  const coverImageUrl = post.coverImageKey
    ? supabase.storage.from("cover-image").getPublicUrl(post.coverImageKey).data.publicUrl
    : undefined;
  
  console.log('Post categories:', post.categories); // デバッグ用
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.id}`} className="block">
        {coverImageUrl && (
          <div className="mb-4">
            <Image
              src={coverImageUrl}
              alt={post.title}
              width={800}
              height={500}
              className="w-full h-48 object-cover rounded-md"
              unoptimized
            />
          </div>
        )}
        <h2 className="mb-3 text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        
        <div className="flex items-center gap-4 mb-3 text-sm text-slate-500">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
            {new Date(post.createdAt).toLocaleDateString('ja-JP')}
          </div>
          
          {post.categories && post.categories.length > 0 && (
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTag} className="mr-1" />
              <div className="flex gap-1">
                {post.categories.map((postCategory, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                  >
                    {postCategory.category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div
          className="line-clamp-3 text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </Link>
    </div>
  );
};

export default PostSummary;