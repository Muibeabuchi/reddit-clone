// import React, { MouseEventHandler, useState } from "react";
import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import AuthButtons from "../../Navbar/RightContent/AuthButtons";
import { useUser } from "@clerk/clerk-react";
// import { ReactMutation } from "convex/react";
// import { FunctionReference } from "convex/server";
// import { Id } from "convex/_generated/dataModel";

type CommentInputProps = {
  comment: string;
  setComment: (value: string) => void;
  loading: boolean;
  onCreateComment: () => Promise<void>;
};

const CommentInput: React.FC<CommentInputProps> = ({
  comment,
  setComment,
  loading,
  onCreateComment,
}) => {
  const { user } = useUser();
  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1}>
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>{user.firstName}</span>
          </Text>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What are your thoughts?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              // bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            zIndex="10"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!comment.length}
              isLoading={loading}
              _disabled={{
                cursor: "not-allowed",
              }}
              onClick={() => onCreateComment()}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
