import Feed from "@/components/Feed";
import Image from "@/components/Image";
import { prisma } from "@/libs/prisma.config";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const UserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const { userId: currentUserId } = await auth();

  if (!currentUserId) return;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
        },
      },
      followings: {
        where: { followerId: currentUserId },
      },
    },
  });

  console.log({ user }, "<---userprofile");

  return (
    <div className="-rose-500">
      {/* PROFILE TITLE */}
      <div className="-violet-500 flex items-center gap-5 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">{user?.displayName}</h1>
      </div>

      {/* INFO */}
      <div className="-cyan-500">
        {/* COVER & AVATAR CONTAINER */}
        <div className="-fuchsia-600 relative w-full">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative">
            <Image path={user?.cover || "general/cover.jpg"} alt="" w={600} h={200} tr={true} />
          </div>

          {/* AVATAR */}
          <div className="w-1/6 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image path={user?.img || "general/noAvatar.jpg"} alt="" w={70} h={70} tr={true} />
          </div>
        </div>

        <div className="b-amber-500 flex w-full items-center justify-end gap-2 p-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/more.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/explore.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/message.svg" alt="more" w={20} h={20} />
          </div>
          <button className="py-2 px-4 bg-white text-black text-sm font-bold rounded-full">Follow</button>
        </div>

        {/* USER DETAILS */}
        <div className="b-emerald-600 p-4 flex flex-col gap-2">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">{user?.displayName}</h1>
            <span className="text-textGray text-sm">@{user?.username}</span>
          </div>

          {user?.bio && <p>{user?.bio}</p>}

          {/* JOB & LOCATION & DATE */}
          <div className="flex gap-4 text-textGray text-[15px]">
            {user?.location && (
              <div className="flex items-center gap-2">
                <Image path="icons/userLocation.svg" alt="location" w={20} h={20} />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>
                Joined {""}
                {new Date((user?.createdAt ?? "").toString()).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{user?._count.followers}</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{user?._count.followings}</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEED */}
      <Feed userProfileId={user?.id} />
    </div>
  );
};

export default UserPage;
