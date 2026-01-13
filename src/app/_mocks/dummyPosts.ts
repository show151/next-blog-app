import type { Post } from "@/app/_types/Post";

const dummyPosts: Post[] = [
  {
    id: "1d4cbd35-6ec2-4f34-b3e7-4a9b35a60d1a",
    createdAt: "2024-10-26T22:48:30.156Z",
    title: "毎日を丁寧に生きるとは",
    content:
      "人生で最も大切なのは、毎日をいかに丁寧に生きるかということです。<br/>朝の光を感じ、目の前の人と心を通わせ、小さな喜びを大切にする。<br/>こうした日々の営みが、やがて素晴らしい人生を作り上げるのです。<br/>急ぐ必要はありません。ゆっくり、でも着実に前へ進むこと。それが人生の本質ではないでしょうか。",
    coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-red.jpg",
    categories: [
      {
        category: {
          id: "587ac4ab-92de-450c-9423-5e091d16ecb5",
          name: "ライフスタイル",
        },
      },
      {
        category: {
          id: "f8a4c465-2e7f-455d-aa1d-5098e9d0086d",
          name: "思考・哲学",
        },
      },
    ],
  },
  {
    id: "24f932b8-231b-429b-b9dc-569f07ba16a7",
    createdAt: "2024-10-24T22:37:17.367Z",
    title: "失敗から学ぶ人生の価値",
    content:
      "人生には失敗がつきものです。<br/>大切なのはその失敗にどう向き合うかです。<br/>失敗を避けるのではなく、そこから何を学ぶか。<br/>その試行錯誤の先に、本当の成長と自分らしい人生が待っているのです。",
    coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-green.jpg",
    categories: [
      {
        category: {
          id: "587ac4ab-92de-450c-9423-5e091d16ecb5",
          name: "自己成長",
        },
      },
    ],
  },
  {
    id: "36b7c693-4cce-4d73-afa3-acb54a404290",
    createdAt: "2024-10-22T11:22:34.684Z",
    title: "人間関係が人生を変える",
    content:
      "人生における最大の財産は、人間関係です。<br/>家族、友人、職場の仲間、人生のどこかで出会った人たち。<br/>これらの関係が私たちを支え、時に導き、何度も立ち上がらせてくれます。<br/>相手を思いやり、自分を開く勇気を持つことが、本当に豊かな人生への第一歩なのです。",
    coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-purple.jpg",
    categories: [
      {
        category: {
          id: "587ac4ab-92de-450c-9423-5e091d16ecb5",
          name: "人間関係",
        },
      },
      {
        category: {
          id: "5cf22131-bac8-4bd0-be8e-757cec2bcc9a",
          name: "自己成長",
        },
      },
    ],
  },
];

export default dummyPosts;
