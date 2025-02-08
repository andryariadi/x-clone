"use client";

const FollowButton = ({ userId, isFollowed }: { userId: string; isFollowed: boolean }) => {
  return <button className="py-2 px-4 bg-white text-black text-sm font-bold rounded-full">{isFollowed ? "Unfollow" : "Follow"}</button>;
};

export default FollowButton;
