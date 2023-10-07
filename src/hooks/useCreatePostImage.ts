import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function useCreatePostImage() {
  const generateUploadUrl = useMutation(api.community.generateUploadUrl);

  const [postImage, setPostImage] = useState<File | null>(null);

  // console.log(postImage);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreatePostImage() {
    if (!postImage) return;
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": postImage!.type },
        body: postImage,
      });
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      const { storageId } = json;
      return storageId as string;
      setPostImage(null);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    handleCreatePostImage,
    isLoading,
    postImage,
    setPostImage,
  };
}
