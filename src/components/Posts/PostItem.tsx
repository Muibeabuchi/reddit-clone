// import { Post } from "@/atoms/PostsAtom";
import {
  Flex,
  Icon,
  Image,
  // Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Doc } from "convex/_generated/dataModel";
import moment from "moment";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import {
  BsChat,
  // BsDot
} from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  // IoArrowBackCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoArrowDownCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";
import useDeletePost from "@/hooks/useDeletePost";

type Props = {
  post: Doc<"posts">;
  // userIsCreator: boolean;
  votes: Doc<"votes"> | undefined;
  // onVote: (post: Post, vote: number, communityId: string) => void;
  // onDeletePost: (post: Post) => Promise<boolean>;
  // onSelectPost: () => void;
};

function PostItem({
  post,
  votes,
}: // userIsCreator,
// onDeletePost,
// onSelectPost,
// onVote,
Props) {
  // const navigate = useNavigate();
  const voteMutation = useMutation(api.votes.voteOnPost);
  const { user } = useUser();

  // const userIsCreator =
  //   getUserIdFromIdentityIdentifier(post.) === user?.id;

  // console.log(userIsCreator);
  console.log(post.authorId);

  // const [loadingImage, setLoadingImage] = React.useState(true);

  const [mutationError, setMutationError] = React.useState();
  const [loadingVote, setLoadingVote] = useState(false);

  const { handlePostDelete, loadingDelete } = useDeletePost();

  async function onVote(voteStatus: 1 | -1) {
    setLoadingVote(true);
    try {
      await voteMutation({
        voteStatus,
        postId: post._id,
      });
      console.log("voting completeted");
    } catch (error) {
      setMutationError(error);
      console.log("voting error", error);
    } finally {
      setLoadingVote(false);
    }
  }

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor="gray.300"
      borderRadius={4}
      _hover={{ borderColor: "gray.500" }}
      cursor="pointer"
      // onClick={() => navigate()}
    >
      <Flex
        direction="column"
        align="center"
        bg="gray.100"
        p={2}
        width="40px"
        borderRadius={4}
      >
        <Icon
          as={
            user
              ? votes?.voteStatus === 1
                ? IoArrowUpCircleSharp
                : IoArrowUpCircleOutline
              : IoArrowUpCircleOutline
          }
          color={
            user
              ? votes?.voteStatus === 1
                ? "brand.100"
                : "gray.400"
              : "gray.400"
          }
          fontSize={22}
          onClick={() => onVote(1)}
          cursor={"pointer"}
        />
        <Text fontSize="9pt">{post.numberOfVotes}</Text>
        <Icon
          as={
            user
              ? votes?.voteStatus === -1
                ? IoArrowDownCircleSharp
                : IoArrowDownCircleOutline
              : IoArrowDownCircleOutline
          }
          color={
            user
              ? votes?.voteStatus === -1
                ? "#4379ff"
                : "gray.400"
              : "gray.400"
          }
          fontSize={22}
          onClick={() => onVote(-1)}
          cursor={"pointer"}
        />
      </Flex>
      <Flex direction={"column"} width="100%">
        <Stack spacing={1} p="10px">
          <Stack
            direction={"row"}
            spacing={0.6}
            align={"center"}
            fontSize={"9pt"}
          >
            {/* home page check */}
            <Text mr={3}> Posted by u/{post.authorName} </Text>
            <Text>{moment(new Date(post._creationTime)).fromNow()}</Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.postTitle}
          </Text>
          <Text fontSize={"10pt"}>{post.postBody}</Text>
          {post.postImageId && (
            <Flex justify={"center"} align="center" p={2}>
              {/* <Skeleton isLoaded={!loadingImage}> */}
              <Image
                src={post.postImageId}
                alt="post image"
                maxH="460px"
                // onLoad={() => setLoadingImage(false)}
              />
              {/* </Skeleton> */}
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align={"center"}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize={"9pt"}>{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align={"center"}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize={"9pt"}>Share</Text>
          </Flex>
          <Flex
            align={"center"}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize={"9pt"}>Save</Text>
          </Flex>
          {/* {userIsCreator && ( */}
          <Flex
            align={"center"}
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
            onClick={() => handlePostDelete(post._id)}
          >
            {loadingDelete ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Icon as={AiOutlineDelete} mr={2} />
                <Text fontSize={"9pt"}>Delete</Text>
              </>
            )}
          </Flex>
          {/* )} */}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PostItem;
