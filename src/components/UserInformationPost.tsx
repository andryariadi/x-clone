"use client";

import { useOnlineUsers } from "@/context/OnlineUsersContext";
import Image from "./Image";

type UserProps = {
  displayName: string | null;
  username: string;
  img?: string | null;
};

const UserInformationPost = ({ type, user }: { type?: "status" | "comment"; user: UserProps }) => {
  const { onlineUsers } = useOnlineUsers();

  const isOnline = onlineUsers.some((u) => u.username === user?.username);

  return (
    <div className="relative">
      <div className={`${type === "status" && "hidden"} relative w-10 h-10 rounded-full overflow-hidden`}>
        <Image path={user.img || "general/noAvatar.jpg"} alt={user.displayName || user.username} w={100} h={100} tr={true} className="rounded-full" />
      </div>
      {isOnline && <div className={`absolute z-10 top-[26px] right-0 w-3 h-3 ${isOnline ? "bg-emerald-700" : "bg-rose-500"} rounded-full border-2 border-white`}></div>}
    </div>
  );
};

export default UserInformationPost;
