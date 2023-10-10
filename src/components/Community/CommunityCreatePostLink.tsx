// import { authModalState } from "@/atoms/AuthModalAtom";
import useDirectory from "@/hooks/useDirectory";
import { Flex, Icon, Input } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
// import { useSetRecoilState } from "recoil";

type CommunityCreatePostLinkType = {
  communityName?: string;
};

const CommunityCreatePostLink = ({
  communityName,
}: CommunityCreatePostLinkType) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { toggleMenuOpen } = useDirectory();

  const location = useLocation();
  // const locationArray = location.pathname.split("/");
  // const ishomepage = !!locationArray[0];
  // console.log(location);

  const onClick = () => {
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
      align="center"
      justify="space-evenly"
      padding={2}
      mb={4}
      borderRadius={4}
      bg="white"
      height="56px"
      border="1px solid"
      borderColor="gray.300"
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon
        as={BsLink45Deg}
        fontSize={24}
        color={"gray.400"}
        cursor="pointer"
      />
    </Flex>
  );
};

export default CommunityCreatePostLink;
