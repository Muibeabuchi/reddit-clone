import { Image } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import Directory from "./Directory/Directory";
import Communities from "./Directory/Communities";
import useStoreUserEffect from "@/hooks/useStoreUser";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const userId = useStoreUserEffect();
  const navigate = useNavigate();
  // console.log(userId);
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        mr={{ base: 0, md: 2 }}
        width={{ base: "40px", md: "auto" }}
        onClick={() => navigate("/")}
        _hover={{
          cursor: "pointer",
        }}
      >
        <Image
          src="/images/icons8-reddit-ios-16-glyph-96.png"
          height="30px"
          alt="navbar logo image"
        />
        <Image
          src="/images/redditText.svg"
          display={["none", "none", "unset"]}
          height="46px"
          alt="navbar logo text"
        />
      </Flex>
      <Directory />
      <SearchInput />
      <RightContent />
    </Flex>
  );
}
