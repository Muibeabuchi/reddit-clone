import React, { memo, useState } from "react";
import {
  // Avatar,
  Box,
  Flex,
  Icon,
  // Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import moment from "moment";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from "react-icons/io5";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CommentWithVotesType } from "convex/comments";
import { useUser } from "@clerk/clerk-react";
// import { ReactMutation } from "convex/react";
// import { FunctionReference } from "convex/server";
import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";
// import { useUser } from "@clerk/clerk-react";
// import { api } from "../../../../convex/_generated/api";
// import { useQuery } from "convex/react";

type CommentItemProps = {
  comment: CommentWithVotesType;
  onDeleteComment: (commentId: Id<"comments">) => Promise<void>;
  isLoading: boolean;
  userProfileId: Id<"profile"> | null | undefined;
  onVoteOnComment: (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    commentId: Id<"comments">,
    voteStatus: 1 | -1
  ) => Promise<void>;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userProfileId,
  onDeleteComment,
  isLoading,
  onVoteOnComment,
  // userId,
}) => {
  const { user } = useUser();
  const onEdit = useMutation(api.comments.editComment);
  const [editable, setEditable] = useState(false);
  const [edittedComment, setEdittedComment] = useState(comment.commentBody);

  const hasEditted = edittedComment !== comment.commentBody;

  const commentVotes = comment.votes.find(
    (vote) => getUserIdFromIdentityIdentifier(vote.voterAuthToken) === user?.id
  );

  // comment.votes.

  function handleEditText() {
    if (edittedComment.length < 1) {
      return "Edit";
    } else if (editable && hasEditted) {
      return "Post";
    } else if (editable && !hasEditted) {
      return "unEdit";
    } else if (!editable) {
      return "Edit";
    }
  }

  async function handleEditable() {
    if (!editable) {
      setEditable(true);
    } else {
      if (!hasEditted) {
        setEditable(false);
        return;
      }
      if (edittedComment.length < 1) {
        setEditable(false);
        setEdittedComment(comment.commentBody);
        return;
      }
      await onEdit({
        commentId: comment._id,
        editedCommentBody: edittedComment,
      });
      setEditable(false);
    }
  }
  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1} width={"100%"}>
        <Stack direction="row" align="center" spacing={2} fontSize="8pt">
          <Text
            fontWeight={700}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {comment.authorName}
          </Text>
          {comment._creationTime && (
            <Text color="gray.600">
              {moment(new Date(comment._creationTime)).fromNow()}
            </Text>
          )}
          {isLoading && <Spinner size="sm" />}
        </Stack>

        {/* change the text to input based on a piece of state */}

        {editable ? (
          <Textarea
            resize={"none"}
            // disabled={true}
            // _disabled={{
            //   color: "gray.700",
            // }}
            // maxHeight="fit-content"
            // _focus={{
            //   outline: "#47cc8a",
            //   borderColor: "#47cc8a",
            // }}
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "0px",
              },
              "&::-webkit-scrollbar-track": {
                width: "0px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
                borderRadius: "0px",
              },
            }}
            defaultValue={comment.commentBody}
            value={edittedComment}
            onChange={(e) => setEdittedComment(e.target.value)}
            width={"100%"}
          />
        ) : (
          <Text fontSize="10pt">{comment.commentBody}</Text>
        )}

        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.500"
        >
          {/* <Icon as={IoArrowUpCircleOutline} /> */}
          <Icon
            as={
              user
                ? commentVotes?.voteStatus === 1
                  ? IoArrowUpCircleSharp
                  : IoArrowUpCircleOutline
                : IoArrowUpCircleOutline
            }
            color={
              user
                ? commentVotes?.voteStatus === 1
                  ? "brand.100"
                  : "gray.400"
                : "gray.400"
            }
            fontSize={18}
            onClick={(e) => onVoteOnComment(e, comment._id, 1)}
            cursor={"pointer"}
          />
          <Text fontSize={12}>{comment.numberOfVotes}</Text>
          {/* <Icon as={IoArrowDownCircleOutline} /> */}
          <Icon
            as={
              user
                ? commentVotes?.voteStatus === -1
                  ? IoArrowDownCircleSharp
                  : IoArrowDownCircleOutline
                : IoArrowDownCircleOutline
            }
            color={
              user
                ? commentVotes?.voteStatus === -1
                  ? "red.400"
                  : "gray.400"
                : "gray.400"
            }
            fontSize={18}
            onClick={(e) => onVoteOnComment(e, comment._id, -1)}
            cursor={"pointer"}
          />

          {/* pass a boolean from hook that sends the usersProfileId */}

          {userProfileId === comment.authorId && (
            <>
              <Text
                fontSize="9pt"
                _hover={{ color: "#47cc8a" }}
                onClick={handleEditable}
              >
                {handleEditText()}
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "#47cc8a" }}
                onClick={() => onDeleteComment(comment._id)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
const MemoizesComment = memo(CommentItem);
export default MemoizesComment;
