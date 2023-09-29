// import { Community } from "@/atoms/communitiesAtom";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import moment from "moment";
import { Doc } from "convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { Link, useParams } from "react-router-dom";
import CommunityAboutAdmin from "./CommunityAboutAdmin";

type Props = {
  communityData: Doc<"community">;
};

const CommunityAbout = ({ communityData }: Props) => {
  const { communityName } = useParams<{ communityName: string }>();
  const { user } = useUser();
  //   console.log(communitypage);
  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        color="white"
        bg="#32a86d"
        borderRadius={"4px 4px 0px 0px"}
        p={3}
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width={"100%"} p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.communityMembers.length}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            p={1}
            align="center"
            width="100%"
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} mr={2} />
            {communityData?._creationTime && (
              <Text>
                Created{" "}
                {moment(new Date(communityData?._creationTime)).format(
                  "MMM DD,YYYY"
                )}
              </Text>
            )}
          </Flex>
          {user && (
            <Link to={`/r/${communityName}/submit`}>
              <Button mt={3} height="30px" width="100%">
                Create Post
              </Button>
            </Link>
          )}
          <CommunityAboutAdmin communityData={communityData} />
        </Stack>
      </Flex>
    </Box>
  );
};

export default CommunityAbout;
