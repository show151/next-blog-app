import type { Category } from "./Category";

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  coverImageKey?: string;
  categories: {
    category: Category;
  }[];
};
