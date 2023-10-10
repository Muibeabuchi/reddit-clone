import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import CommentItem from "./CommentItem";
import CommentInput from "./Input";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
// import { CommentWithVotesType } from "convex/comments";

type CommentsProps = {
  postId: Id<"posts">;
  communityName: string;
};

const Comments = ({ postId, communityName }: CommentsProps) => {
  const [postingComment, setPostingComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState<Id<"comments"> | null>(
    null
  );

  const { user } = useUser();

  const userProfileId = useQuery(api.profile.getUserProfile, {
    userId: user?.id,
  });

  // const userProfileId = useQuery(api.profile.getUserProfile, {
  //   userId: user?.id,
  // });

  const {
    results: postComments,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.comments.getPostComments,
    { postId: postId },
    { initialNumItems: 5 }
  );

  // console.log(postComments);

  const onCreateComment = useMutation(api.comments.createComment);
  const onDeleteComment = useMutation(api.comments.deletecomment);

  async function createComment() {
    setPostingComment(true);
    try {
      await onCreateComment({
        commentBody: comment,
        communityName,
        postId,
      });
      setComment("");
    } catch (error) {
      // console.log(error);
    }

    setPostingComment(false);
  }

  async function deleteComment(commentId: Id<"comments">) {
    if (!userProfileId) return;
    setDeletingComment(commentId);
    try {
      await onDeleteComment({
        authorId: userProfileId,
        commentId: commentId,
      });
    } catch (error) {
      // console.log(error);
    }
    setDeletingComment(null);
  }

  // console.log(postComments);
  const [comment, setComment] = useState("");
  // const [comments, setComments] = useState<Comment[]>([]);
  // const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  // const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState("");
  // const setAuthModalState = useSetRecoilState(authModalState);
  // const setPostState = useSetRecoilState(postState);

  // const onCreateComment = async (comment: string) => {
  //   if (!user) {
  //     setAuthModalState({ open: true, view: "login" });
  //     return;
  //   }

  //   setCommentCreateLoading(true);
  //   try {
  //     const batch = writeBatch(firestore);

  //     // Create comment document
  //     const commentDocRef = doc(collection(firestore, "comments"));
  //     batch.set(commentDocRef, {
  //       postId: selectedPost.id,
  //       creatorId: user.uid,
  //       creatorDisplayText: user.email!.split("@")[0],
  //       creatorPhotoURL: user.photoURL,
  //       communityId: community,
  //       text: comment,
  //       postTitle: selectedPost.title,
  //       createdAt: serverTimestamp(),
  //     } as Comment);

  //     // Update post numberOfComments
  //     batch.update(doc(firestore, "posts", selectedPost.id), {
  //       numberOfComments: increment(1),
  //     });
  //     await batch.commit();

  //     setComment("");
  //     const { id: postId, title } = selectedPost;
  //     setComments((prev) => [
  //       {
  //         id: commentDocRef.id,
  //         creatorId: user.uid,
  //         creatorDisplayText: user.email!.split("@")[0],
  //         creatorPhotoURL: user.photoURL,
  //         communityId: community,
  //         postId,
  //         postTitle: title,
  //         text: comment,
  //         createdAt: {
  //           seconds: Date.now() / 1000,
  //         },
  //       } as Comment,
  //       ...prev,
  //     ]);

  //     // Fetch posts again to update number of comments
  //     setPostState((prev) => ({
  //       ...prev,
  //       selectedPost: {
  //         ...prev.selectedPost,
  //         numberOfComments: prev.selectedPost?.numberOfComments! + 1,
  //       } as Post,
  //       postUpdateRequired: true,
  //     }));
  //   } catch (error: any) {
  //     console.log("onCreateComment error", error.message);
  //   }
  //   setCommentCreateLoading(false);
  // };

  const mutateCommentWithVote = useMutation(api.votes.voteOnComment);

  async function onVoteOnComment(
    // @ts-expect-error did not use the event object
    e: React.MouseEvent<SVGElement, MouseEvent>,
    commentId: Id<"comments">,
    voteStatus: 1 | -1
  ) {
    await mutateCommentWithVote({
      commentId,
      voteStatus,
    });
  }

  // console.log(status);w

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={postingComment}
          onCreateComment={createComment}
        />
      </Flex>
      <Stack
        spacing={6}
        p={2}
        paddingBottom={10}
        // overflowY="auto"
        // maxHeight="300px"
        position="relative"
        sx={{
          "&::-webkit-scrollbar": {
            width: "10px",
            borderRadius: "8px",
            backgroundColor: `rgba(0, 0, 0, 0.05)`,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: `blue.400`,
          },
        }}
      >
        {status === "LoadingFirstPage" ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {postComments.length ? (
              <>
                {postComments.map((item) => (
                  <CommentItem
                    key={item._id}
                    comment={item}
                    onDeleteComment={deleteComment}
                    userProfileId={userProfileId}
                    isLoading={deletingComment === item._id}
                    onVoteOnComment={onVoteOnComment}
                  />
                ))}
                {status !== "Exhausted" && (
                  <Button
                    disabled={status === "LoadingMore"}
                    onClick={() => loadMore(10)}
                    position="absolute"
                    bottom="-1"
                    marginX="auto"
                    _disabled={{
                      cursor: "not-allowed",
                    }}
                    paddingY="1"
                    height={8}
                    width={40}
                    paddingX="8"
                    // left="0"
                    // right="0"
                    alignSelf="center"
                  >
                    {status === "LoadingMore" ? (
                      <LoadmoreSpinner />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                )}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;

function LoadmoreSpinner() {
  return <span className="loader"></span>;
}
