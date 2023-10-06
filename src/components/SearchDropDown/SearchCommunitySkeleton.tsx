// import React from 'react'

import { Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function SearchCommunitySkeleton() {
  return (
    <Flex alignItems="center" gap="4px" padding="3px" borderRadius="4px">
      <SkeletonCircle size="24px" endColor="#47cc8a" />
      <SkeletonText
        skeletonHeight="2"
        size="10px"
        height="10px"
        width="70%"
        noOfLines={1}
        endColor="#47cc8a"
      />
    </Flex>
  );
}
