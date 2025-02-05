import Comments from "@/components/Comments";
import Image from "@/components/Image";
import Post from "@/components/Post";
import Link from "next/link";

const StatusPage = () => {
  return (
    <div className="bg-amber-500">
      <header className="flex items-center gap-5 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </header>

      {/* Post Type */}
      <Post type="status" />

      {/* Comments */}
      <Comments />
    </div>
  );
};

export default StatusPage;
