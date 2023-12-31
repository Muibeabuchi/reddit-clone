import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "convex/_generated/dataModel";
import { useToast } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// const errorMessages = {
//   "[CONVEX M(posts:deleteCommunityPost)] Uncaught Error: user is not permitted to delete this post":
//     "user is not permitted to delete this post",
// };

export default function useDeletePost() {
  // check if we are on community page or single page
  const location = useLocation();
  const x = location.pathname.split("/");
  const isSinglePage = !!x[3];
  // console.log(isSinglePage);

  const navigate = useNavigate();

  const { communityName } = useParams();

  const [loadingDelete, setLoadingDelete] = useState(false);
  const toast = useToast();
  const deletPost = useMutation(api.posts.deleteCommunityPost);
  async function handlePostDelete(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: Id<"posts">
  ) {
    e.stopPropagation();
    setLoadingDelete(true);
    try {
      await deletPost({ postId });
      if (isSinglePage) return navigate(`/r/${communityName}`);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Unauthorized action, can't delete this post",
        // description: errorMessages[error.message],
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setLoadingDelete(false);
  }
  return {
    handlePostDelete,
    loadingDelete,
    setLoadingDelete,
    isSinglePage,
  };
}
