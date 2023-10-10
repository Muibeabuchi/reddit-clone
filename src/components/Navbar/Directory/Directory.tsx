// import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
// import { useState } from "react";
// import {FaRedditSquare} from 'react-icons/fa'
// import { BiChevronDown } from "react-icons/bi";
// import {VscAccount} from 'react-icons/vsc'
// import {CgProfile} from 'react-icons/cg'
// import {MdOutlineLogin} from 'react-icons/md'
// import { useSetRecoilState } from 'recoil'
// import { authModalState } from '@/atoms/AuthModalAtom'
// import { IoSparkles } from 'react-icons/io5'
// import { TiHome } from "react-icons/ti";

import { Authenticated } from "convex/react";
import useDirectory from "@/hooks/useDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Communities from "./Communities";
// import Communities from "./Communities";
// type DirectoryPropTypes = {
//   children: ReactNode;
// };

const Directory = () => {
  // const { user } = useUser();

  // const [open, setOpen] = useState(false);
  // const handleClose = () => setOpen(false);

  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <>
      <Authenticated>
        <Menu isOpen={directoryState.isOpen}>
          {() => (
            <>
              <MenuButton
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                mr={2}
                ml={{ base: 0, md: 2 }}
                onClick={toggleMenuOpen}
              >
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width={{ base: "auto", lg: "200px" }}
                >
                  <Flex alignItems="center">
                    <>
                      {directoryState.selectedMenuItem.imageURL ? (
                        <Image
                          borderRadius={{ base: "5px", lg: "full" }}
                          boxSize={{ base: "30px", lg: "34px" }}
                          // boxSize="24px"
                          src={directoryState.selectedMenuItem.imageURL}
                          mr={2}
                          // display={{ base: "none", lg: "flex" }}
                        />
                      ) : (
                        <Icon
                          fontSize={24}
                          mr={{ base: 1, md: 2 }}
                          color={"#47cc8a"}
                          as={directoryState.selectedMenuItem.icon}
                        />
                      )}
                      <Box
                        display={{ base: "none", lg: "flex" }}
                        flexDirection="column"
                        fontSize="10pt"
                      >
                        <Text fontWeight={600}>
                          {directoryState.selectedMenuItem.displayText}
                        </Text>
                      </Box>
                    </>
                  </Flex>
                  <ChevronDownIcon
                    color="gray.500"
                    display={{ base: "none", lg: "flex" }}
                  />
                </Flex>
              </MenuButton>
              <MenuList
                maxHeight="300px"
                overflow="scroll"
                overflowX="hidden"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "14px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    // background: "#4299E1",
                    borderRadius: "5px",
                  },
                }}
              >
                <Communities />
              </MenuList>
            </>
          )}
        </Menu>
      </Authenticated>
    </>
  );
};

export default Directory;
