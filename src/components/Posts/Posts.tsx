// import { Post } from "@/atoms/PostsAtom";
import PostItem from "./PostItem";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";
// import { Doc } from "convex/_generated/dataModel";
import { CommunityPostsAndVotes } from "@/pages/communityPage";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

// export type postsType =
// type PostsProps = {
// communityPosts: CommunityPostsAndVotes[] | undefined;
// communityVotes: Doc<"votes">[];
// };

const Posts = ({
  communityName,
}: {
  communityName: string;
}): React.ReactNode => {
  const communityPosts = useQuery(api.posts.getCommunityPosts, {
    communityName,
  });
  // const { postStateValue, setPostValue, onDeletePost, onSelectPost, onVote } =
  //   usePosts();communityPosts

  // if (communityPosts === undefined) return <PostLoader />;
  return (
    <>
      {communityPosts === undefined ? (
        <PostLoader numberOfSkeletons={3} />
      ) : (
        <Stack spacing={2}>
          {communityPosts?.map((post) => (
            <PostItem
              key={post._id}
              // onDeletePost={onDeletePost}
              // onSelectPost={onSelectPost}
              // onVote={onVote}
              post={post}
              // votes={communityVotes.find((c) => c.postId === post._id)}
              // userIsCreator={user?.uid === post.creatorId}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
