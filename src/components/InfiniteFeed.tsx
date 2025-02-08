"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch("http://localhost:3000/api/posts?cursor=" + pageParam + "&user=" + userProfileId);

  console.log("http://localhost:3000/api/posts?cursor=" + pageParam + "&user=" + userProfileId, "<----difetchPosts");

  return res.json();
};

const InfiniteFeed = ({ userProfileId }: { userProfileId?: string }) => {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId), // Fetch posts with pageParam as cursor
    initialPageParam: 2, // Start from page 2
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 2 : undefined), // Get next page only if hasMore is true
  });

  if (error) return <h1>{error.message}</h1>;
  if (status === "pending") return <span>Loading...</span>;

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  console.log({ data, userProfileId, allPosts }, "<---infinitefeed");

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <p style={{ textAlign: "center" }}>
          <b>Loading...</b>
        </p>
      }
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {allPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
