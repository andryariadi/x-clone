import Comments from "@/components/Comments";
import Image from "@/components/Image";
import Post from "@/components/Post";
import { prisma } from "@/libs/prisma.config";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const StatusPage = async ({ params }: { params: Promise<{ username: string; postId: string }> }) => {
  const { username, postId } = await params;

  const { userId: currentUserId } = await auth();

  if (!currentUserId) return;

  const post = await prisma.post.findFirst({
    where: { id: Number(postId) },
    include: {
      user: {
        select: {
          displayName: true,
          username: true,
          img: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          rePosts: true,
        },
      },
      likes: {
        where: { userId: currentUserId },
        select: { id: true },
      },
      rePosts: {
        where: { userId: currentUserId },
        select: { id: true },
      },
      saves: {
        where: { userId: currentUserId },
        select: { id: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              displayName: true,
              username: true,
              img: true,
            },
          },

          _count: {
            select: {
              comments: true,
              likes: true,
              rePosts: true,
            },
          },
          likes: {
            where: { userId: currentUserId },
            select: { id: true },
          },
          rePosts: {
            where: { userId: currentUserId },
            select: { id: true },
          },
          saves: {
            where: { userId: currentUserId },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!post) return notFound();

  // console.log({ username, postId, post }, "<---singlePost");

  return (
    <div>
      <header className="flex items-center gap-5 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </header>

      {/* Post Type */}
      <Post type="status" post={post} />

      {/* Comments */}
      <Comments comments={post.comments} postId={post.id} username={post.user.username} />
    </div>
  );
};

export default StatusPage;
