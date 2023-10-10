import { Alert, AlertIcon, Text } from "@chakra-ui/react";
// import React from "react";

// type Props = {};

export default function PostErrorAlert() {
  return (
    <Alert status="error">
      <AlertIcon />
      <Text>Error creating post</Text>
    </Alert>
  );
}
