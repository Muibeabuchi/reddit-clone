import useSelectFile from "@/hooks/useSelectFile";
import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";
import {
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { Doc } from "convex/_generated/dataModel";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type Props = {
  communityData: Doc<"community">;
};

const CommunityAboutAdmin = ({ communityData }: Props) => {
  const { user } = useUser();
  const { communityName } = useParams<{ communityName: string }>();
  const { selectedFile, setSelectedFile, onSelectImage } = useSelectFile();
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const selectedFileRef = React.useRef<HTMLInputElement>(null);
  // const setCommunityStateValue = useSetRecoilState(communitiesState);

  // generate shortlived upload url
  const generateUploadUrl = useMutation(api.community.generateUploadUrl);
  const updateCommunityImage = useMutation(api.community.mutateCommunityImage);

  const [image, setImage] = React.useState<File | null>(null);

  // create function for updating the community imageUrl
  async function onUpdateImage() {
    if (!selectedFile) return;
    if (!image) return;
    if (!communityName) return;
    if (!user?.id) return;

    setUploadingImage(true);
    // todo write uploading community image logic here
    try {
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image!.type },
        body: selectedFile,
      });
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      const { storageId } = json;
      await updateCommunityImage({
        storageId,
        author: user?.id,
        communityName: communityName,
      });

      setSelectedFile("");
      setImage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setUploadingImage(false);
    }
  }
  return (
    <>
      {user?.id ===
        getUserIdFromIdentityIdentifier(communityData?.creatorId) && (
        <>
          <Divider />
          <Stack spacing={1} fontSize="10pt">
            <Text fontWeight={700}>Admin</Text>
            <Flex align="center" justify="space-between">
              <Text
                color="blue.500"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => selectedFileRef?.current?.click()}
              >
                Change Image
              </Text>
              <input
                hidden
                ref={selectedFileRef}
                type="file"
                onChange={(e) => {
                  onSelectImage(e);
                  if (!e.target.files?.[0]) return;
                  setImage(e.target.files?.[0]);
                }}
              />
              {communityData?.communityImage || selectedFile ? (
                <Image
                  src={selectedFile || communityData?.communityImage}
                  alt="community image url"
                  borderRadius={4}
                  boxSize="40px"
                />
              ) : (
                <Icon as={FaReddit} fontSize={40} color="brand.100" mr={2} />
              )}
            </Flex>
            {selectedFile &&
              (uploadingImage ? (
                <Spinner />
              ) : (
                <Flex
                  fontWeight={600}
                  padding="4px 6px"
                  bg="gray.300"
                  _hover={{ bg: "blue.400" }}
                  cursor="pointer"
                  borderRadius={5}
                  onClick={onUpdateImage}
                  width={"50%"}
                >
                  Save Changes
                </Flex>
              ))}
          </Stack>
        </>
      )}
    </>
  );
};

export default CommunityAboutAdmin;
