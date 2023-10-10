// import { Post } from "@/atoms/PostsAtom";
import {
  Flex,
  Icon,
  Image,
  Skeleton,
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
  BsDot,
  // BsDot
} from "react-icons/bs";
// import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  // IoArrowBackCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoArrowDownCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
// import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";
import useDeletePost from "@/hooks/useDeletePost";
import { CommunityPostsAndVotes } from "@/pages/communityPage";
import { FaReddit } from "react-icons/fa";

type Props = {
  post: CommunityPostsAndVotes;
  // userIsCreator: boolean;
  // votes: Doc<"votes"> | undefined;
  // onVote: (post: Post, vote: number, communityId: string) => void;
  // onDeletePost: (post: Post) => Promise<boolean>;
  // onSelectPost: () => void;
};

function PostItem({
  post,
}: // votes,
// userIsCreator,
// onDeletePost,
// onSelectPost,
// onVote,
Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const homepage = location.pathname === "/";
  // console.log(homepage);
  const voteMutation = useMutation(api.votes.voteOnPost);
  const { user } = useUser();

  const userProfileId = useQuery(api.profile.getUserProfile, {
    userId: user?.id,
  });

  const postVotes = post?.postVotes?.find(
    (vote) => vote.voterId === userProfileId
  );

  // .find(
  //   (vote) => vote.voterId === userProfileId
  // );
  // if (!post) return;
  // console.log(post);
  // console.log(userProfileId);

  // const userIsCreator =
  //   getUserIdFromIdentityIdentifier(post.) === user?.id;

  // console.log(userIsCreator);
  // console.log(post.authorId);

  const [loadingImage, setLoadingImage] = React.useState(true);

  // const [mutationError, setMutationError] = React.useState();
  const [loadingUpVote, setLoadingUpVote] = useState(false);
  const [loadingDownVote, setLoadingDownVote] = useState(false);

  const {
    handlePostDelete,
    loadingDelete,
    isSinglePage: singlePostView,
  } = useDeletePost();

  async function onVote(
    e: React.MouseEvent<SVGElement, MouseEvent>,
    voteStatus: 1 | -1
  ) {
    e.stopPropagation();
    if (voteStatus === 1) {
      setLoadingUpVote(true);
    } else if (voteStatus === -1) {
      setLoadingDownVote(true);
    }
    try {
      await voteMutation({
        voteStatus,
        postId: post._id,
      });
      // console.log("voting completeted");
    } catch (error) {
      // setMutationError(error);
      // console.log("voting error", error);
    } finally {
      if (voteStatus === 1) {
        setLoadingUpVote(false);
      } else if (voteStatus === -1) {
        setLoadingDownVote(false);
      }
    }
  }

  function handleNavigate(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) {
    e.stopPropagation();
    navigate(`/r/${post.communityName}`);
  }
  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostView ? "white" : "gray.300"}
      borderRadius={singlePostView ? "4px 4px 0px 0px" : 4}
      cursor={singlePostView ? "unset" : "pointer"}
      _hover={{ borderColor: singlePostView ? "none" : "gray.500" }}
      onClick={() => navigate(`/r/${post.communityName}/comments/${post._id}`)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostView ? "none" : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePostView ? "0" : "3px 0px 0px 3px"}
      >
        {loadingUpVote ? (
          <Spinner size="xs" color="#47cc8a" />
        ) : (
          <Icon
            as={
              user
                ? postVotes?.voteStatus === 1
                  ? IoArrowUpCircleSharp
                  : IoArrowUpCircleOutline
                : IoArrowUpCircleOutline
            }
            color={
              user
                ? postVotes?.voteStatus === 1
                  ? "brand.100"
                  : "gray.400"
                : "gray.400"
            }
            fontSize={22}
            onClick={(e) => onVote(e, 1)}
            cursor={"pointer"}
          />
        )}
        <Text fontSize="9pt">{post.numberOfVotes}</Text>

        {loadingDownVote ? (
          <Spinner size="xs" color="red.400" />
        ) : (
          <Icon
            as={
              user
                ? postVotes?.voteStatus === -1
                  ? IoArrowDownCircleSharp
                  : IoArrowDownCircleOutline
                : IoArrowDownCircleOutline
            }
            color={
              user
                ? postVotes?.voteStatus === -1
                  ? "red.400"
                  : "gray.400"
                : "gray.400"
            }
            fontSize={22}
            onClick={(e) => onVote(e, -1)}
            cursor={"pointer"}
          />
        )}
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
            {homepage && (
              <>
                {post.communityImageUrl ? (
                  <Image
                    borderRadius="full"
                    boxSize="18px"
                    src={post.communityImageUrl}
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize={18} mr={1} color="#47cc8a" />
                )}
                {/* <Link to={`r/${post.communityName}`}> */}
                <Text
                  fontWeight={700}
                  _hover={{ textDecoration: "underline" }}
                  onClick={handleNavigate}
                >{`r/${post.communityName}`}</Text>
                {/* </Link> */}
                <Icon as={BsDot} color="#47cc8a" fontSize={8} />
              </>
            )}
            <Text mr={3}> Posted by u/{post.authorName} </Text>
            <Text>{moment(new Date(post._creationTime)).fromNow()}</Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.postTitle}
          </Text>
          <Text fontSize={"10pt"}>{post.postBody}</Text>
          {post.postImageId && (
            <Flex justify={"center"} align="center" p={2}>
              <Skeleton isLoaded={!loadingImage}>
                <Image
                  src={post.postImageId}
                  alt="post image"
                  maxH="460px"
                  onLoad={() => setLoadingImage(false)}
                />
              </Skeleton>
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
            onClick={() =>
              navigate(`/r/${post.communityName}/comments/${post._id}`)
            }
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
          {userProfileId === post.authorId && (
            <Flex
              align={"center"}
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor={"pointer"}
              onClick={(e) => handlePostDelete(e, post._id)}
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
          )}
          {/* )} */}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PostItem;
