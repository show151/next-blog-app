"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faBullseye, faLaptopCode, faHeart, faRocket } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const lifeValues = [
    { title: "自己成長", description: "毎日小さな成長を積み重ねること", icon: faRocket },
    { title: "人間関係", description: "相手を理解し、心を通わせること", icon: faHeart },
    { title: "思考・哲学", description: "人生について深く考え、学ぶこと", icon: faBullseye }
  ];

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">About Me</h1>
        <p className="text-sm sm:text-base text-slate-600">人生を歩む一人の男性 Show</p>
      </div>

      <div
        className={twMerge(
          "mx-auto mb-8 w-full sm:w-2/3",
          "flex justify-center",
        )}
      >
        <Image
          src="/images/avatar.png"
          alt="Showのプロフィール画像"
          width={300}
          height={300}
          priority
          className="rounded-full border-4 border-purple-300 p-1.5 shadow-lg w-48 h-48 sm:w-64 sm:h-64"
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-purple-500">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faHeart} className="mr-2 text-purple-600" />
            自己紹介
          </h2>
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3">
            <p>
              こんにちは！Showです。
              日々の生活の中で感じたこと、学んだこと、人生の転機や成長の瞬間を大切に記録し、シェアしていきたいと思っています。
            </p>
            <p>
              人生は一度きり。その中で出会う様々な経験、喜び、悲しみ、挑戦、そして成長。
              これらすべてが私たちを形作り、より豊かな人生へと導いてくれると信じています。
            </p>
            <p>
              このブログでは、人生について考え、学んだことを綴っています。
              自己成長、人間関係、キャリア、ライフスタイルなど、人生のあらゆる側面をテーマに、一緒に成長していきたいと思います。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-indigo-500">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faBullseye} className="mr-2 text-indigo-600" />
            このブログを書く目的
          </h2>
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3">
            <p>
              <strong>1. 人生の学びを記録する</strong><br />
              毎日の経験から得た学びを整理し、自分の人生を深く理解するため。
            </p>
            <p>
              <strong>2. 共感と繋がり</strong><br />
              人生について考える他の人たちと、経験や思想を共有し、心を通わせたい。
            </p>
            <p>
              <strong>3. 人生の質を高める</strong><br />
              自分の人生をより豊かに、より有意義にしていくための試みです。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-pink-500">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faHeart} className="mr-2 text-pink-600" />
            大切にしている価値観
          </h2>
          <div className="space-y-4">
            {lifeValues.map((value, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-semibold text-slate-700 text-sm sm:text-base mb-1">{value.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 text-center border border-purple-200"> 
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">
            一緒に人生を歩んでいきましょう
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            人生について考えること、学んだこと、感じたことを、一緒にシェアしていきたいと思います。
            ご質問やコメント、お話などがありましたら、お気軽にお声がけください。
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;