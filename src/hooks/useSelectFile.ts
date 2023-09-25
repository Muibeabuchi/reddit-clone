// import { useUser } from "@clerk/clerk-react";
import React from "react";

// type Props = {}

// const convexSiteUrl = import.meta.env.VITE_CONVEX_URL;

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = React.useState("");

  // const { user } = useUser();

  function onSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  }

  // async function updateCommunityImage(file: File, communityName: string) {
  //   if (!user) return;

  //   const sendImageUrl = new URL(`${convexSiteUrl}/updateCommunityImage`);
  //   sendImageUrl.searchParams.set("author", user?.id);
  //   sendImageUrl.searchParams.set("community", communityName);
  //   try {
  //     await fetch(sendImageUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": file!.type,
  //         // Origin: "http://localhost:3000",
  //         "Access-Control-Allow-Origin": "http://localhost:3000",
  //         "Access-Control-Allow-Methods": "POST",
  //         "Access-Control-Allow-Headers": "Content-Type, Digest",
  //         "Access-Control-Max-Age": "86400",
  //         Vary: "origin",
  //       },
  //       body: selectedFile,
  //     });
  //     setSelectedFile("");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  return {
    selectedFile,
    onSelectImage,
    setSelectedFile,
    // updateCommunityImage,
  };
};

export default useSelectFile;
