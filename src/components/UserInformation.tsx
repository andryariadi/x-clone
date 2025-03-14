"use client";

import { useUser } from "@clerk/nextjs";
import Image from "./Image";
import { useOnlineUsers } from "@/context/OnlineUsersContext";

const UserInformation = () => {
  const { user } = useUser();

  const { onlineUsers } = useOnlineUsers();

  if (!user) return <span>Loading...</span>;

  const isOnline = onlineUsers.some((u) => u.username === user?.username);

  console.log({ user, isOnline, onlineUsers }, "<---userInformation");

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 relative b-amber-600">
          <Image src={user?.imageUrl || "general/noAvatar.jpg"} alt={user?.username ?? ""} w={100} h={100} tr={true} className="rounded-full" />
          {isOnline && <div className={`absolute z-10 bottom-0 right-0 w-3 h-3 ${isOnline ? "bg-emerald-700" : "bg-rose-500"} rounded-full border-2 border-white`}></div>}
        </div>
        <div className="hidden xxl:flex flex-col">
          <span className="font-bold">{user?.fullName}</span>
          <span className="text-sm text-textGray">@{user?.username}</span>
        </div>
      </div>

      <div className="hidden xxl:block cursor-pointer font-bold">...</div>
    </div>
  );
};

export default UserInformation;
