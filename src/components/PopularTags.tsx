import Link from "next/link";
import Image from "./Image";

const PopularTags = () => {
  return (
    <div className="b-sky-600 p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-2">
      <h1 className="text-lg font-bold text-textGrayLight">{"What's"} Happening</h1>

      {/* TREND EVENT */}
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
          <Image path="general/cover.jpg" alt="event" w={50} h={50} tr={true} />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-base text-textGrayLight">Nadal v Federer Grand Slam</h2>
          <span className="text-sm text-textGray">Last Night</span>
        </div>
      </div>

      {/* TOPICS */}
      <div className="border-b border-borderGray pb-1">
        <div className="flex items-center justify-between">
          <span className="text-textGray text-sm">Technology • Trending</span>
          <Image path="icons/infoMore.svg" alt="info" w={16} h={16} />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-textGrayLight text-base font-bold">OpenAI</h2>
          <span className="text-textGray text-sm">20K posts</span>
        </div>
      </div>

      {/* TOPICS */}
      <div className="border-b border-borderGray pb-1">
        <div className="flex items-center justify-between">
          <span className="text-textGray text-sm">Technology • Trending</span>
          <Image path="icons/infoMore.svg" alt="info" w={16} h={16} />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-textGrayLight text-base font-bold">OpenAI</h2>
          <span className="text-textGray text-sm">20K posts</span>
        </div>
      </div>

      {/* TOPICS */}
      <div className="border-b border-borderGray pb-1">
        <div className="flex items-center justify-between">
          <span className="text-textGray text-sm">Technology • Trending</span>
          <Image path="icons/infoMore.svg" alt="info" w={16} h={16} />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-textGrayLight text-base font-bold">OpenAI</h2>
          <span className="text-textGray text-sm">20K posts</span>
        </div>
      </div>

      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default PopularTags;
