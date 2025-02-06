import { prisma } from "@/libs/prisma.config";
import Post from "./Post";
import { auth } from "@clerk/nextjs/server";
import InfiniteFeed from "./InfiniteFeed";

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) return;

  const whereCondition = userProfileId
    ? { userId: userProfileId, parentPostId: null }
    : {
        parentPostId: null,
        userId: {
          in: [
            currentUserId,
            ...(
              await prisma.follow.findMany({
                where: {
                  followerId: currentUserId,
                },
                select: {
                  followingId: true,
                },
              })
            ).map((follow) => follow.followingId),
          ],
        },
      };

  // Fetch posts from current user and following users
  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          displayName: true,
          username: true,
          img: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    skip: 0,
  });

  console.log({ postsTotal: posts.length, userProfileId, currentUserId }, "<---feedcomponent");

  return (
    <section className="b-rose-600">
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}

      <InfiniteFeed />
    </section>
  );
};

export default Feed;
