import { Image } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import Directory from "./Directory/Directory";
import Communities from "./Directory/Communities";
import useStoreUserEffect from "@/hooks/useStoreUser";

export default function Navbar() {
  const userId = useStoreUserEffect();
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
      >
        <Image
          src="/images/redditFace.svg"
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
      <Directory>{<Communities />}</Directory>
      <SearchInput />
      <RightContent />
    </Flex>
  );
}
