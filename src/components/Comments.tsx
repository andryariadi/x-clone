"use client";

import { Post as PostType } from "@prisma/client";
import Image from "./Image";
import Post from "./Post";
import { useUser } from "@clerk/nextjs";
import { useActionState, useEffect } from "react";
import { addComment } from "@/libs/actions";
import { socket } from "@/Socket";

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
  const { isLoaded, isSignedIn, user } = useUser();

  const [stateComment, formAction, isPending] = useActionState(addComment, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (stateComment.success) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: user?.username,
          type: "comment",
          link: `/${username}/status/${postId}`,
        },
      });
    }
  }, [stateComment.success, user?.username, username, postId]);

  console.log({ comments, postId, username, isLoaded, isSignedIn, user }, "<---commentComponent");

  return (
    <div className="b-rose-600">
      {/* Form Comment */}
      {user && (
        <form action={formAction} className="flex items-center justify-between gap-4 p-4 ">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={user?.imageUrl} alt="Lama Dev" w={100} h={100} tr={true} />
          </div>
          <input type="number" name="postId" hidden readOnly value={postId} />

          <input type="string" name="username" hidden readOnly value={username} />

          <input type="text" name="desc" className="flex-1 bg-transparent outline-none p-2 text-lg placeholder:text-lg" placeholder="Post your reply" />

          <button className="py-2 px-4 font-bold bg-white text-black text-sm rounded-full disabled:cursor-not-allowed disabled:bg-slate-200" disabled={isPending}>
            {isPending ? "Replying..." : "Reply"}
          </button>
        </form>
      )}

      {stateComment?.error && <span className="text-red-300 p-4">Something went wrong!</span>}

      {comments.map((comment) => (
        <div key={comment.id}>
          <Post post={comment} type="comment" />
        </div>
      ))}
    </div>
  );
};

export default Comments;
