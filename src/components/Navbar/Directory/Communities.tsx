// import { useState } from "react";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { getUserIdFromIdentityIdentifier } from "@/utils/helperFunctions";
import { useUser } from "@clerk/clerk-react";
import MenuListItem from "./MenuListItem";
import { FaReddit } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { createCommunityModal } from "@/atoms/createCommuityModal";

export default function Communities() {
  const { user } = useUser();

  const [communityModal, setCommunityModal] =
    useRecoilState(createCommunityModal);
  // const [open, setOpen] = useState(false);
  const usersCommunities = useQuery(api.community.getUserCommunities);

  if (!usersCommunities) return;
  // console.log(usersCommunities);

  // const isModerator =
  // console.log(user?.id);

  function handleClose() {
    setCommunityModal(false);
  }

  return (
    <>
      <CreateCommunityModal open={communityModal} handleClose={handleClose} />
      {usersCommunities?.find((item) => {
        return (
          getUserIdFromIdentityIdentifier(item?.communityCreator) === user?.id
        );
      }) && (
        <Box mt={3} mb={4}>
          <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
            MODERATING
          </Text>
          {usersCommunities
            ?.filter(
              (item) =>
                getUserIdFromIdentityIdentifier(item?.communityCreator) ===
                user?.id
            )
            .map((snippet) => (
              <MenuListItem
                key={snippet?.communityId}
                displayText={`r/${snippet?.communityName}`}
                link={`/r/${snippet?.communityName}`}
                icon={FaReddit}
                iconColor="brand.100"
                imageURL={snippet?.communityImage}
              />
            ))}
        </Box>
      )}
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setCommunityModal(true)}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {usersCommunities?.map((snippet) => (
          <MenuListItem
            key={snippet?.communityId}
            icon={FaReddit}
            displayText={`r/${snippet?.communityName}`}
            link={`/r/${snippet?.communityName}`}
            iconColor="#47cc8a"
            imageURL={snippet?.communityImage}
          />
        ))}
      </Box>
    </>
  );
}
