import { authModalState } from "@/atoms/AuthModalAtom";
import {
  // Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  // ModalFooter,
  Flex,
  // Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
// import OAuthButtons from "./OAuthButtons";
import { useEffect, useCallback } from "react";
// import ResetPassword from "./ResetPassword";

import { useUser } from "@clerk/clerk-react";

const AuthModal: React.FC = () => {
  const { user } = useUser();

  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleClose = useCallback(() => {
    setModalState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }, [setModalState]);

  useEffect(() => {
    if (user) handleClose();
  }, [user, handleClose]);

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={modalState.open} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetpassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            pb={6}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              {modalState.view === "login" || modalState.view === "signup" ? (
                <>
                  {/* <OAuthButtons /> */}
                  {/* <Text fontWeight={700} color="gray.500">
                    OR
                  </Text> */}
                  <AuthInputs />
                </>
              ) : null}
              {/* // : ( // <ResetPassword /> */}
              {/* // ) */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
