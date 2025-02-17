"use server";

import { auth } from "@clerk/nextjs/server";
import { imagekit } from "./utils";
import { prisma } from "./prisma.config";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

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

export const addPost = async (prevState: { success: boolean; error: boolean }, formData: FormData) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId)
      return {
        success: false,
        error: true,
      };

    const desc = formData.get("desc");
    const file = formData.get("file") as File;
    const isSensitive = formData.get("isSensitive") as string;
    const imgType = formData.get("imgType");

    const uploadFile = async (file: File): Promise<UploadResponse> => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const transformation = `w-600,${imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""}`;

      return new Promise((resolve, reject) => {
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
          },
          function (error, result) {
            if (error) reject(error);
            else resolve(result as UploadResponse);
          }
        );
      });
    };

    const postSchema = z.object({
      desc: z.string().max(150),
      isSensitive: z.boolean().optional(),
    });

    const validatedFields = postSchema.safeParse({
      desc,
      isSensitive: JSON.parse(isSensitive),
    });

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        error: true,
      };
    }

    let img = "";
    let imgHeight = 0;
    let video = "";

    if (file.size) {
      const result: UploadResponse = await uploadFile(file);

      if (result.fileType === "image") {
        img = result.filePath;
        imgHeight = result.height;
      } else {
        video = result.filePath;
      }
    }

    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId: currentUserId,
        img,
        imgHeight,
        video,
      },
    });

    revalidatePath(`/`);

    return { success: true, error: false };
  } catch (error) {
    console.log(error, "<---errorAddPost");
    return {
      success: false,
      error: true,
    };
  }
};

export const addComment = async (prevState: { success: boolean; error: boolean }, formData: FormData) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId)
      return {
        success: false,
        error: true,
      };

    const postId = formData.get("postId");
    const desc = formData.get("desc");
    const username = formData.get("username");

    const commentSchema = z.object({
      parentPostId: z.number(),
      desc: z.string().max(150),
    });

    const validatedFields = commentSchema.safeParse({
      parentPostId: Number(postId),
      desc,
    });

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);

      return {
        success: false,
        error: true,
      };
    }

    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId: currentUserId,
      },
    });

    revalidatePath(`${username}/status/${postId}`);

    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error, "<----errorAddComment");
    return {
      success: false,
      error: true,
    };
  }
};

export const followUser = async (targetUserId: string) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) return;

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId, // Check if the current user is already following the target user
        followingId: targetUserId, // Check if the target user is being followed
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });
    }
  } catch (error) {
    console.log(error, "<----errorFollowUser");
  }
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
