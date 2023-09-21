import { Flex } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
// import AuthModal from "@/components/Modal/Auth/AuthModal";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import Icons from "../Icons";
import UserMenu from "./UserMenu";

import { useUser } from "@clerk/clerk-react";
import { SignUpButton, SignOutButton } from "@clerk/clerk-react";

// import { SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react";

// type RightContentProps = {
//   user?: User | null;
// };
import { useConvexAuth } from "convex/react";

const RightContent: React.FC = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();

  // console.log(isLoading);
  // console.log(isAuthenticated);
  return (
    <>
      <AuthModal />

      <Flex justify="center" align="center">
        <Icons />
        <AuthButtons />
        <UserMenu />
      </Flex>
    </>
  );
};

export default RightContent;
