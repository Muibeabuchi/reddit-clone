import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import CommunityAbout from "../Community/CommunityAbout/CommunityAbout";
import { Doc } from "convex/_generated/dataModel";
import { HamburgerIcon } from "@chakra-ui/icons";

type Props = {
  communityData: Doc<"community">;
};

export default function DrawerExample({ communityData }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        // size={'lg'}
        // rightIcon={}
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
        borderRadius={"10px"}
        // width={"30px"}
        // height={"30px"}
        display={{ base: "block", md: "none" }}
      >
        {/* CommunityData */}
        <HamburgerIcon boxSize={5} />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        blockScrollOnMount
        size={"xs"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody background="gray.200" paddingTop="50px">
            <CommunityAbout communityData={communityData} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
