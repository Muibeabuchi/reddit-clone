// import React from 'react'

import { Flex, Text } from "@chakra-ui/react";

export default function CommuityEmptyPost({
  communityName,
}: {
  communityName: string;
}) {
  return (
    <Flex
      direction="column"
      width="100%"
      justifyContent={"center"}
      alignItems={"center"}
      paddingTop={5}
      gap="6px"
      bg="white"
      borderRadius="5px"
      padding="6px"
      paddingBottom="12px"
    >
      <Text fontWeight={700} fontSize={["12px", "26px"]}>
        Welcome to the{" "}
        <Text
          as="span"
          fontFamily="cursive"
          color="#47cc8a"
          fontSize="2xl"
          fontWeight={600}
        >
          {communityName}
        </Text>{" "}
        community
      </Text>

      <Text letterSpacing="wider" color="slateblue" fontSize={["14px", "16px"]}>
        🎉 Start creating posts 🙌
      </Text>
      <Text letterSpacing="wider" color="slateblue" fontSize={["14px", "16px"]}>
        to share with community Members
      </Text>
    </Flex>
  );
}
