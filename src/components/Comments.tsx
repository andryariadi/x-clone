import { Post as PostType } from "@prisma/client";
import Image from "./Image";
import Post from "./Post";

type CommentWithDetails = PostType & {
  user: {
    displayName: string | null;
    username: string;
    img: string | null;
  };
  _count: {
    likes: number;
    rePosts: number;
    comments: number;
  };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Comments = ({ comments, postId, username }: { comments: CommentWithDetails[]; postId: number; username: string }) => {
  console.log({ comments, postId, username }, "<---commentsComponent");

  return (
    <div className="b-rose-600">
      {/* Form Comment */}
      <form className="flex items-center justify-between gap-4 p-4 ">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image path="general/avatar.png" alt="Lama Dev" w={100} h={100} tr={true} />
        </div>
        <input type="text" className="flex-1 bg-transparent outline-none p-2 text-lg placeholder:text-lg" placeholder="Post your reply" />
        <button className="py-2 px-4 font-bold bg-white text-black text-sm rounded-full">Reply</button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id}>
          <Post post={comment} type="comment" />
        </div>
      ))}
    </div>
  );
};

export default Comments;
