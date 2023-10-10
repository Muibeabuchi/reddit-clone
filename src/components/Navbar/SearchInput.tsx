import useSearchCommunities from "@/hooks/useSearchCommunities";
import { SearchIcon } from "@chakra-ui/icons";
import {
  // Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  // Skeleton,
} from "@chakra-ui/react";

import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import SearchDropdown from "../SearchDropDown/SearchDropdown";
// type SearchInputProps = {
//   user: User | undefined | null;
// };
const SearchInput: React.FC = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const { searchedCommunities, loadingSearchedCommunities } =
    useSearchCommunities(searchTerm);

  function clearSearchTerm() {
    setSearchTerm("");
  }

  // console.log(searchedCommunities);
  return (
    // <Stack width="100%" maxW={user ? "100%" : "600px"}>
    <Stack
      align="center"
      flexGrow={1}
      mr={2}
      maxW={user ? "auto" : "600px"}
      // position="relative"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" mb={1} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Reddit"
          fontSize={["7pt", "10pt"]}
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid ",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid ",
            borderColor: "blue.500",
          }}
          height="34px"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </InputGroup>
      {/* // todo -- show the dropdown component only if the text search length > 0 */}
      {searchTerm.length > 0 ? (
        <SearchDropdown
          communities={searchedCommunities}
          clearSearchTerm={clearSearchTerm}
          isLoading={loadingSearchedCommunities}
        />
      ) : null}
    </Stack>

    // </Stack>
  );
  // };
};

export default SearchInput;
