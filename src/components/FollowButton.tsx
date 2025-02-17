"use client";

import { followUser } from "@/libs/actions";
import { useOptimistic, useState } from "react";

const FollowButton = ({ userId, isFollowed }: { userId: string; isFollowed: boolean }) => {
  const [followState, setFollowState] = useState(isFollowed);

  const handleFollowUser = async () => {
    switchOptimisticFollow("");
    await followUser(userId);
    setFollowState((prev) => !prev);
  };

  const [optimisticFollowState, switchOptimisticFollow] = useOptimistic(followState, (currentFollowState) => !currentFollowState);

  return (
    <form action={handleFollowUser}>
      <button className="py-2 px-4 bg-white text-black text-sm font-bold rounded-full">{optimisticFollowState ? "Unfollow" : "Follow"}</button>
    </form>
  );
};

export default FollowButton;
