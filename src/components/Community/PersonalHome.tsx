import React from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { createCommunityModal } from "@/atoms/createCommuityModal";
import { useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import useDirectory from "@/hooks/useDirectory";

const PersonalHome: React.FC = () => {
  const setCommunityState = useSetRecoilState(createCommunityModal);
  function handleCreateCommunity() {
    setCommunityState(true);
  }

  const { user } = useUser();
  const navigate = useNavigate();

  const { toggleMenuOpen } = useDirectory();

  const location = useLocation();
  // const locationArray = location.pathname.split("/");
  // const ishomepage = !!locationArray[0];
  // console.log(location);

  const onClick = (communityName: string) => {
    if (!user) {
      return;
    }
    if (location.pathname === "/") {
      return toggleMenuOpen();
    }
    if (communityName) {
      navigate(`/r/${communityName}/submit`);
    }
  };
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reddit frontpage, built for you.
          </Text>
          <Button height="30px" onClick={onClick}>
            Create Post
          </Button>
          <Button
            variant="outline"
            height="30px"
            onClick={handleCreateCommunity}
          >
            Create Community
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PersonalHome;
