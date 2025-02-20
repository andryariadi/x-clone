"use client";

import { followUser } from "@/libs/actions";
import { socket } from "@/Socket";
import { useUser } from "@clerk/nextjs";
import { useOptimistic, useState } from "react";

const FollowButton = ({ userId, isFollowed, username }: { userId: string; isFollowed: boolean; username: string }) => {
  const [followState, setFollowState] = useState(isFollowed);
  const { user: currentUser } = useUser();

  const handleFollowUser = async () => {
    if (!currentUser) return;

    if (!optimisticFollowState) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: currentUser.username,
          type: "follow",
          link: `/${username}`,
        },
      });
    }

    switchOptimisticFollow("");
    await followUser(userId);
    setFollowState((prev) => !prev);
  };

  const [optimisticFollowState, switchOptimisticFollow] = useOptimistic(followState, (currentFollowState) => !currentFollowState);

  // console.log({ isFollowed, optimisticFollowState }, "<---followButton");

  return (
    <form action={handleFollowUser}>
      <button className="py-2 px-4 bg-white text-black text-sm font-bold rounded-full">{optimisticFollowState ? "Unfollow" : "Follow"}</button>
    </form>
  );
};

export default FollowButton;
