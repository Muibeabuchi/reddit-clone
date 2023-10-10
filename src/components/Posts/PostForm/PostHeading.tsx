import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

function PostHeading() {
  const { communityName } = useParams();
  return (
    <Box padding="14px 0px" borderBottom="1px solid white">
      <Text fontWeight={600} textAlign={"center"}>
        Create a post on the{" "}
        <Text as="span" textColor={"#47cc8a"}>
          {communityName?.toUpperCase()}
        </Text>{" "}
        community
      </Text>
    </Box>
  );
}

export default PostHeading;
