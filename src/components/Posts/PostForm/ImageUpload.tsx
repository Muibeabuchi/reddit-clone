import { Image } from "@chakra-ui/react";
import { Button, Flex, Stack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile?: string;
  setSelectedTab: (value: string) => void;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  postImage: File | null;
  setPostImage: Dispatch<SetStateAction<File | null>>;
};

export default function ImageUpload({
  onSelectImage,
  selectedFile,
  setPostImage,
  setSelectedFile,
  setSelectedTab,
}: Props) {
  const selectedFileRef = React.useRef<HTMLInputElement>(null);
  return (
    <Flex justify={"center"} align="center" width="100%" direction="column">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            alt="selected image"
            maxWidth="400px"
            maxHeight="400px"
          />
          <Stack justifyContent="flex-end" direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to post
            </Button>
            <Button
              height="28px"
              variant="outline"
              onClick={() => {
                setSelectedFile("");
                setPostImage(null);
              }}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          padding={20}
          width="100%"
          border="1px dashed"
          borderColor="gray.200"
          borderRadius={4}
        >
          <Button
            onClick={() => selectedFileRef?.current?.click()}
            variant={"outline"}
            height="28px"
          >
            Upload
          </Button>
          <input
            type="file"
            hidden={true}
            ref={selectedFileRef}
            onChange={(e) => {
              onSelectImage(e);
              if (!e.target.files?.[0]) return;
              setPostImage(e.target.files?.[0]);
            }}
          />
        </Flex>
      )}
    </Flex>
  );
}
