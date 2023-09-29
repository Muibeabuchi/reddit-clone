import { useEffect } from "react";
import { useRecoilState } from "recoil";
// import { communityState } from "../atoms/communitiesAtom";
import {
  defaultMenuItem,
  DirectoryMenuItem,
  directoryMenuState,
} from "../atoms/directoryMenuAtom";
import { FaReddit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const useDirectory = () => {
  const { communityName } = useParams();
  const navigate = useNavigate();
  const usersCommunities = useQuery(api.community.getUserCommunities);

  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    navigate(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  const existingCommunity = usersCommunities?.find(
    (item) => item.communityName === communityName
  );
  useEffect(() => {
    if (existingCommunity?.communityId) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${existingCommunity.communityName}`,
          link: `r/${existingCommunity.communityName}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: existingCommunity.communityImage,
        },
      }));
      return;
    }
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem,
    }));
  }, [
    existingCommunity?.communityId,
    existingCommunity?.communityImage,
    existingCommunity?.communityName,
    setDirectoryState,
  ]);

  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;
