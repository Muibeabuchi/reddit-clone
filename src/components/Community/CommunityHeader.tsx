// import { Community } from "@/atoms/communitiesAtom";
import {
  getUserIdFromIdentityIdentifier,
  isUserMemberOfCommunity,
} from "@/utils/helperFunctions";
import { Box, Flex, Icon, Image, Text, Button } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { Doc } from "convex/_generated/dataModel";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";

type CommunityHeaderProps = {
  communityData: Doc<"community">;
  communityName: string;
};
const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  communityData,
  communityName,
}) => {
  const { user } = useUser();
  // console.log(user);
  const joinOrLeaveCommunity = useMutation(api.community.joinOrLeaveCommunity);
  const isCommunityCreator =
    getUserIdFromIdentityIdentifier(communityData.creatorId) === user?.id;
  // console.log("is community creator", isCommunityCreator);
  const isJoined = isUserMemberOfCommunity(communityData, user?.id);

  return (
    <Flex direction={"column"} width={"100%"} height="146px">
      <Box height="50%" width="100%" bg="blue.400"></Box>
      <Flex flexGrow={1} bg="white" justify="center">
        <Flex width={"95%"} maxW={"860px"}>
          {communityData?.communityImage ? (
            <Image
              src={communityData?.communityImage}
              alt="community image"
              boxSize={"66px"}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="full"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              border="4px solid white"
              borderRadius="50%"
              position="relative"
              top="-5px"
              color="blue.400"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction={"column"} mr={6}>
              <Text fontWeight={800} fontSize={"16pt"}>
                {communityData?.communityName}
              </Text>
              <Text fontWeight={600} fontSize={"10t"} color={"gray.400"}>
                r/{communityData?.communityName}
              </Text>
            </Flex>
            {!isCommunityCreator && (
              <Button
                variant={isJoined ? "outline" : "solid"}
                height={"30px"}
                pr={6}
                pl={6}
                // isLoading={loading}
                onClick={() => joinOrLeaveCommunity({ communityName })}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CommunityHeader;
