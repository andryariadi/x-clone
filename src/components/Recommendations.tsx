import Link from "next/link";
import Image from "./Image";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/libs/prisma.config";

const Recommendations = async () => {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) return;

  const followingIds = await prisma.follow.findMany({
    where: {
      followerId: currentUserId,
    },
    select: { followingId: true },
  });

  const followedUserIds = followingIds.map((follow) => follow.followingId);

  const friendRecommendations = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
        notIn: followedUserIds,
      },
      followings: {
        some: {
          followerId: {
            in: followedUserIds,
          },
        },
      },
    },
    take: 3,
    select: {
      id: true,
      username: true,
      displayName: true,
      img: true,
    },
  });

  console.log({ currentUserId, followingIds, followedUserIds, friendRecommendations }, "<---recommendations");

  return (
    <div className="b-rose-500 p-3 rounded-2xl border-[1px] border-borderGray flex flex-col gap-3">
      {/* USER CARD */}
      {friendRecommendations.map((recomendation) => (
        <div key={recomendation.id} className="flex items-center justify-between">
          {/* IMAGE AND USER INFO */}
          <div className="flex items-center gap-2">
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image path={recomendation.img || "general/noAvatar.jpg"} alt={recomendation.username || "Avatar"} w={100} h={100} tr={true} />
            </div>
            <div className="">
              <h1 className="text-base font-bold">{recomendation.displayName}</h1>
              <span className="text-textGray text-sm">@{recomendation.username}</span>
            </div>
          </div>
          {/* BUTTON */}
          <button className="py-1 px-4 font-semibold bg-white text-black text-sm rounded-full">Follow</button>
        </div>
      ))}

      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
