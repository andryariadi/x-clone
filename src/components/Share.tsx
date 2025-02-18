"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import Image from "./Image";
import NextImage from "next/image";
import { addPost } from "@/libs/actions";
import ImageEditor from "./ImageEditor";
import { useUser } from "@clerk/nextjs";

const Share = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  const { user } = useUser();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const previewURL = media ? URL.createObjectURL(media) : null;

  const [statePost, formAction, isPending] = useActionState(addPost, {
    success: false,
    error: false,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (statePost.success) {
      formRef.current?.reset();
      setMedia(null);
      setSettings({ type: "original", sensitive: false });
    }
  }, [statePost]);

  return (
    <form ref={formRef} action={formAction} className="b-amber-700 p-4 flex gap-4">
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image src={user?.imageUrl} alt={user?.username ?? ""} w={100} h={100} tr={true} />
      </div>

      {/* Input Form */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Description Input */}
        <input type="text" name="desc" placeholder="What is happening?!" className="bg-transparent outline-none placeholder:text-textGray placeholder:text-lg text-lg" />

        {/* Image Type Input */}
        <input type="text" name="imgType" hidden readOnly value={settings.type} />

        {/* Sensitive Image Input */}
        <input type="text" name="isSensitive" hidden readOnly value={settings.sensitive ? "true" : "false"} />

        {/* Priview Image */}
        {media?.type.includes("image") && previewURL && (
          <div className="relative rounded-xl overflow-hidden">
            <NextImage
              src={previewURL}
              alt=""
              width={600}
              height={600}
              className={`w-full ${settings.type === "original" ? "h-full object-contain" : settings.type === "square" ? "aspect-square object-cover" : "aspect-video object-cover"}`}
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer" onClick={() => setIsEditorOpen(true)}>
              Edit
            </div>
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm" onClick={() => setMedia(null)}>
              X
            </div>
          </div>
        )}

        {/* Preview Video */}
        {media?.type.includes("video") && previewURL && (
          <div className="relative">
            <video src={previewURL} controls />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm" onClick={() => setMedia(null)}>
              X
            </div>
          </div>
        )}

        {/* Image Editor */}
        {isEditorOpen && previewURL && <ImageEditor onClose={() => setIsEditorOpen(false)} previewURL={previewURL} settings={settings} setSettings={setSettings} />}

        {/* Icons Input */}
        <div className="b-emerald-600 flex items-center justify-between gap-4 flex-wrap border-t border-borderGray pt-2">
          <div className="flex gap-4 flex-wrap">
            {/* Upload Image */}
            <input type="file" name="file" onChange={handleMediaChange} className="hidden" id="file" accept="image/*,video/*" />
            <label htmlFor="file">
              <Image path="icons/image.svg" alt="" w={20} h={20} className="cursor-pointer" />
            </label>

            <Image path="icons/gif.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image path="icons/poll.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image path="icons/emoji.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image path="icons/schedule.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image path="icons/location.svg" alt="" w={20} h={20} className="cursor-pointer" />
          </div>

          <button disabled={isPending} className="bg-white text-black text-base font-bold rounded-full py-2 px-4 disabled:cursor-not-allowed disabled:bg-slate-200">
            {isPending ? "Posting..." : "Post"}
          </button>

          {statePost?.error && <span className="text-red-300 p-4">Something went wrong!</span>}
        </div>
      </div>
    </form>
  );
};

export default Share;
