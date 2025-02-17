"use server";

import { auth } from "@clerk/nextjs/server";
import { imagekit } from "./utils";
import { prisma } from "./prisma.config";

export const shareAction = async (formData: FormData, settings: { type: "original" | "wide" | "square"; sensitive: boolean }) => {
  const file = formData.get("file") as File;
  // const desc = formData.get("desc") as string;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transformation = `w-600, ${settings.type === "square" ? "ar-1-1" : settings.type === "wide" ? "ar-16-9" : ""}`;

  imagekit.upload(
    {
      file: buffer,
      fileName: file.name,
      folder: "/posts",
      ...(file.type.includes("image") && {
        transformation: {
          pre: transformation,
        },
      }),
      customMetadata: {
        sensitive: settings.sensitive,
      },
    },
    function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    }
  );
};

export const likePost = async (postId: number) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) return;

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: currentUserId,
        postId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          userId: currentUserId,
          postId,
        },
      });
    }
  } catch (error) {
    console.log(error, "<----errorLikePost");
  }
};

export const repostPost = async (postId: number) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) return;

    const existingRepost = await prisma.post.findFirst({
      where: {
        userId: currentUserId,
        rePostId: postId,
      },
    });

    if (existingRepost) {
      await prisma.post.delete({
        where: { id: existingRepost.id },
      });
    } else {
      await prisma.post.create({
        data: {
          userId: currentUserId,
          rePostId: postId,
        },
      });
    }
  } catch (error) {
    console.log(error, "<---errorRepostPost");
  }
};

export const savedPost = async (postId: number) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) return;

    const existingSavedPost = await prisma.savedPosts.findFirst({
      where: {
        userId: currentUserId,
        postId,
      },
    });

    if (existingSavedPost) {
      await prisma.savedPosts.delete({
        where: { id: existingSavedPost.id },
      });
    } else {
      await prisma.savedPosts.create({
        data: {
          userId: currentUserId,
          postId,
        },
      });
    }
  } catch (error) {
    console.log(error, "<---errorSavedPost");
  }
};
