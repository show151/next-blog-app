
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { Pool } from "pg";

// 環境変数を読み込む
config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  // 各テーブルから既存の全レコードを削除
  await prisma.postCategory?.deleteMany();
  await prisma.post?.deleteMany();
  await prisma.category?.deleteMany();

  // カテゴリデータの作成 (テーマ: 人生)
  const c1 = await prisma.category.create({ data: { name: "自己成長" } });
  const c2 = await prisma.category.create({ data: { name: "人間関係" } });
  const c3 = await prisma.category.create({ data: { name: "キャリア" } });
  const c4 = await prisma.category.create({ data: { name: "ライフスタイル" } });
  const c5 = await prisma.category.create({ data: { name: "思考・哲学" } });

  // 投稿記事データの作成  (人生テーマ)
  const p1 = await prisma.post.create({
    data: {
      title: "人生の転機を迎えて - 決断の先にあるもの",
      content: "人生には時に大きな決断の時が訪れます。<br/>新しい道を選ぶか、今までの道を続けるか。<br/>その決断の先には、想像もしていなかった景色が広がっていました。<br/>失敗を恐れず、自分の心の声に耳を傾けることの大切さを学びました。",
      coverImageKey: "cover-img-red.jpg",
      categories: {
        create: [{ categoryId: c1.id }, { categoryId: c3.id }],
      },
    },
  });

  const p2 = await prisma.post.create({
    data: {
      title: "人間関係の深さと向き合うこと",
      content: "誰もが人間関係に悩み、苦しむ経験をします。<br/>しかし、その過程こそが人生を豊かにする最高の学びです。<br/>相手を理解しようとする努力、そして自分を知ってもらう勇気。<br/>これらが揃った時、本当に意味のある繋がりが生まれるのです。",
      coverImageKey: "cover-img-green.jpg",
      categories: {
        create: [{ categoryId: c2.id }, { categoryId: c1.id }],
      },
    },
  });

  const p3 = await prisma.post.create({
    data: {
      title: "毎日の小さな積み重ねが人生を作る",
      content: "大きな目標も素晴らしいですが、毎日の小さな積み重ねが最も大事です。<br/>一日一日を丁寧に生きること。<br/>朝日を見つめ、人と笑い、新しいことに挑戦する。<br/>こうした習慣の積み重ねが、気づいた時には素晴らしい人生になっているのです。",
      coverImageKey: "cover-img-purple.jpg",
      categories: {
        create: [{ categoryId: c4.id }, { categoryId: c5.id }],
      },
    },
  });

  console.log(JSON.stringify(p1, null, 2));
  console.log(JSON.stringify(p2, null, 2));
  console.log(JSON.stringify(p3, null, 2));
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
