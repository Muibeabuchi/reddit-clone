import useJoinOrLeaveCommunity from "@/hooks/useJoinOrLeaveCommunity";
import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";
import { Flex, Icon, Button, Box, Image, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
// import { Box } from "framer-motion";
import React, { useMemo } from "react";
import { FaReddit } from "react-icons/fa";
import { Link } from "react-router-dom";

export type RecommendedCommunityItemType = {
  communityImage: string | null;
  _id: Id<"community">;
  _creationTime: number;
  creatorId: string;
  communityName: string;
  communityType: "private" | "public" | "restricted";
  communityMembers: string[];
};

export default function RecommendedCommunityItem({
  item,
  index,
}: {
  item: RecommendedCommunityItemType;
  index: number;
}) {
  const { user } = useUser();
  const { onJoinOrLeaveCommunity, loading } = useJoinOrLeaveCommunity();

  const isJoined = useQuery(api.usersCommunities.isMemberOfCommunity, {
    communityId: item._id,
  });

  // const isJoined =
  //   //    useMemo(() => {

  //   !!item?.communityMembers.find(
  //     (item) => getUserIdFromIdentityIdentifier(item) === user?.id
  //   );
  // //   }, [user?.id, item.communityMembers]);
  console.log(isJoined);
  return (
    <Box key={item._id}>
      <Flex
        position="relative"
        align="center"
        fontSize="10pt"
        borderBottom="1px solid"
        borderColor="gray.200"
        p="10px 12px"
        fontWeight={600}
      >
        <Flex
          as={Link}
          to={`r/${item.communityName}`}
          width="80%"
          align="center"
        >
          <Flex width="15%">
            <Text mr={2}>{index + 1}</Text>
          </Flex>
          <Flex align="center" width="80%">
            {item.communityImage ? (
              <Image
                borderRadius="full"
                boxSize="28px"
                src={item.communityImage}
                mr={2}
              />
            ) : (
              <Icon as={FaReddit} fontSize={30} color="brand.100" mr={2} />
            )}
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >{`r/${item.communityName}`}</span>
          </Flex>
        </Flex>
        <Box position="absolute" right="10px">
          <Button
            height="22px"
            fontSize="8pt"
            isLoading={loading}
            onClick={(event) => {
              event.stopPropagation();
              // onJoinLeaveCommunity(item, isJoined);
              onJoinOrLeaveCommunity(item.communityName);
            }}
            variant={isJoined ? "outline" : "solid"}
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
