import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  Stack,
  Text,
  calc,
} from "@chakra-ui/react";
import { Doc } from "convex/_generated/dataModel";
import React from "react";
import { useNavigate } from "react-router-dom";
import SearchCommunitySkeleton from "./SearchCommunitySkeleton";
// import { Link } from "react-router-dom";

type Props = {
  communities: Doc<"community">[] | undefined;
  clearSearchTerm: () => void;
  isLoading: boolean;
};

export default function SearchDropdown({
  communities,
  clearSearchTerm,
  isLoading,
}: Props) {
  const navigate = useNavigate();

  console.log(isLoading);
  console.log(communities);
  // todo--- if communities is undefined return a skeleton component

  // todo -- if communities.length === 0 return a text

  function handleClick(community: string) {
    navigate(`r/${community}`);
    clearSearchTerm();
  }

  // if (!isLoading || communities?.length <= 0) return <SearchCommunitySkeleton />;

  return (
    <Stack
      spacing="5px" //todo --edit later
      // position={"absolute"}
      // bottom="-45px"
      width={"calc(100% - 7px)"}
      backgroundColor="white"
      color="#47cc8a"
      borderRadius="4px"
      paddingY="4px"
      paddingX="7px"
      border="1px #47cc8a solid"
      zIndex={20}
      // minHeight="40px"
      // justifyContent="center"
    >
      {communities?.length <= 0 && (
        <Text fontSize="10px" textAlign="center">
          Sorry, no commuities matched your text
        </Text>
      )}
      {isLoading && <SearchCommunitySkeleton />}
      {communities?.map((item) => (
        <>
          {/* <Skeleton isLoaded={!isLoading && communities?.length <= 0}> */}
          <Flex
            // as={Link}
            // to={`r/${item.communityName}`}
            padding="3px"
            borderRadius="4px"
            onClick={() => handleClick(item.communityName)}
            key={item._id}
            alignItems="center"
            gap="14px"
            _hover={{
              cursor: "pointer",
              bg: "gray.100",
            }}
          >
            {/* communityImage */}
            <Avatar
              name={item.communityName}
              src={item.communityImage}
              size="xs"
              bg="#47cc8a"
            />

            {/* communityName */}
            <Text fontSize="12px">{`r/${item.communityName}`}</Text>
          </Flex>
          {/* </Skeleton> */}
        </>
      ))}
    </Stack>
  );
}
