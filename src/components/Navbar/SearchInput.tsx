import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  // Skeleton,
} from "@chakra-ui/react";

import { useUser } from "@clerk/clerk-react";
// type SearchInputProps = {
//   user: User | undefined | null;
// };
const SearchInput: React.FC = () => {
  const { user } = useUser();
  return (
    <>
      <Flex align="center" flexGrow={1} mr={2} maxW={user ? "auto" : "600px"}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" mb={1} />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search Reddit"
            fontSize="10pt"
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
          />
        </InputGroup>
      </Flex>
    </>
  );
  // };
};

export default SearchInput;
