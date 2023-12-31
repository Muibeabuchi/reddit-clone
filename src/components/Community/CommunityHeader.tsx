// import { Community } from "@/atoms/communitiesAtom";
import {
  getUserIdFromIdentityIdentifier,
  // isUserMemberOfCommunity,
} from "@/utils/helperFunctions";
import { Flex, Icon, Image, Text, Button } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { Doc } from "convex/_generated/dataModel";
// import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import useJoinOrLeaveCommunity from "@/hooks/useJoinOrLeaveCommunity";
import DrawerExample from "../Navbar/DrawerMobile";

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
  // const joinOrLeaveCommunity = useMutation(api.community.joinOrLeaveCommunity);
  const { onJoinOrLeaveCommunity, loading } = useJoinOrLeaveCommunity();
  const isCommunityCreator =
    getUserIdFromIdentityIdentifier(communityData.creatorId) === user?.id;
  // console.log("is community creator", isCommunityCreator);
  // const userProfileId = useQuery(api.profile.getUserProfile,{userId: user?.id})
  // const isJoined = isUserMemberOfCommunity(communityData, user?.id);
  const isJoined = useQuery(api.usersCommunities.isMemberOfCommunity, {
    communityId: communityData._id,
  });

  return (
    <Flex direction={"column"} width={"100%"} height="146px">
      <Flex
        height="50%"
        width="100%"
        bg="#47cc8a"
        justifyContent={"flex-end"}
        paddingX={"20px"}
        paddingY={"20px"}
      >
        <DrawerExample communityData={communityData} />
      </Flex>
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
              color="#47cc8a"
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
                isLoading={loading}
                onClick={() => onJoinOrLeaveCommunity(communityName)}
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
