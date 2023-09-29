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
  IoArrowUpCircleOutline,
} from "react-icons/io5";
import { Doc, Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
// import { useUser } from "@clerk/clerk-react";
// import { api } from "../../../../convex/_generated/api";
// import { useQuery } from "convex/react";

type CommentItemProps = {
  comment: Doc<"comments">;
  onDeleteComment: (commentId: Id<"comments">) => Promise<void>;
  isLoading: boolean;
  userProfileId: Id<"profile"> | null | undefined;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userProfileId,
  onDeleteComment,
  isLoading,
  // userId,
}) => {
  const onEdit = useMutation(api.comments.editComment);
  const [editable, setEditable] = useState(false);
  const [edittedComment, setEdittedComment] = useState(comment.commentBody);

  const hasEditted = edittedComment !== comment.commentBody;

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
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />

          {/* pass a boolean from hook that sends the usersProfileId */}

          {userProfileId === comment.authorId && (
            <>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={handleEditable}
              >
                {handleEditText()}
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
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
