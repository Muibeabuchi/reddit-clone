import {
  Box,
  Button,
  Flex,
  // Icon,
  // Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  // Text,
} from "@chakra-ui/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
// import React, { useEffect, useState } from "react";
// import { FaReddit } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { useMemo } from "react";
// import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";

// import { useMutation } from "convex/react";
// import useJoinOrLeaveCommunity from "@/hooks/useJoinOrLeaveCommunity";
import RecommendedCommunityItem from "./RecommendedCommunityItem";

// type RecommendationsProps = {};

const Recommendations = () => {
  const topCommunities = useQuery(api.community.getCommunityRecommendations);

  // console.log(topCommunities);
  // const { user } = useUser();
  // const { onJoinOrLeaveCommunity } = useJoinOrLeaveCommunity();

  // const isJoined =
  //   // useMemo(
  //   //   () =>
  //   topCommunities?.find((item) => {
  //     const communityMembers = item.communityMembers;
  //     return !!communityMembers.find(
  //       (item) => getUserIdFromIdentityIdentifier(item) === user?.id
  //     );
  //   });
  //   [user?.id, topCommunities]
  // );

  // const joinOrLeaveCommunity = useMutation(api.community.joinOrLeaveCommunity);

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        // bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        // url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {topCommunities === undefined ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {topCommunities.map((item, index) => {
              return (
                <RecommendedCommunityItem
                  item={item}
                  index={index}
                  key={item._id}
                />
              );
            })}
            <Box p="10px 20px">
              <Button height="30px" width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
