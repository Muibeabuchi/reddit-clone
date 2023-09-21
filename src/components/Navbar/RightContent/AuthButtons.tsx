import { Button } from "@chakra-ui/react";

import { Unauthenticated } from "convex/react";
import { SignUpButton, SignInButton } from "@clerk/clerk-react";

const AuthButtons: React.FC = () => {
  return (
    <>
      <Unauthenticated>
        <Button
          variant="outline"
          display={{ base: "none", sm: "flex" }}
          height="28px"
          width={{ base: "70px", md: "110px" }}
          mr={2}
          // onClick={() => setModalState({ open: true, view: "login" })}
        >
          <SignInButton mode="modal" />
        </Button>
        <Button
          display={{ base: "none", sm: "flex" }}
          width={{ base: "70px", md: "110px" }}
          height="28px"
          mr={2}
          // onClick={() => setModalState({ open: true, view: "signup" })}
        >
          <SignUpButton mode="modal" />
        </Button>
      </Unauthenticated>
    </>
  );
};

export default AuthButtons;
