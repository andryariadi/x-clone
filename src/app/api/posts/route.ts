import { prisma } from "@/libs/prisma.config";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userProfileId = searchParams.get("user");
    const page = searchParams.get("cursor");
    const LIMIT = 3;

    const whereCondition =
      userProfileId !== "undefined" // Check if userProfileId is not 'undefined'
        ? { userId: userProfileId || undefined }
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
        rePost: {
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
      orderBy: { createdAt: "desc" },
      take: LIMIT, // Limit the number of posts
      skip: (Number(page) - 1) * LIMIT, // Skip the first n posts
    });

    const totalPosts = await prisma.post.count({
      where: whereCondition,
    });

    const hasMore = Number(page) * LIMIT < totalPosts; // Check if there are more posts

    return NextResponse.json({ posts, hasMore });
  } catch (error) {
    console.log(error, "<---errorFetchPostsRoute");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
