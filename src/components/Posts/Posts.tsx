// import { Post } from "@/atoms/PostsAtom";
import PostItem from "./PostItem";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";
// import { Doc } from "convex/_generated/dataModel";
// import { CommunityPostsAndVotes } from "@/pages/communityPage";

import { usePaginatedQuery } from "convex/react";
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
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.posts.getCommunityPosts,
    {
      communityName,
    },
    {
      initialNumItems: 10,
    }
  );
  // const { postStateValue, setPostValue, onDeletePost, onSelectPost, onVote } =
  //   usePosts();communityPosts

  // if (communityPosts === undefined) return <PostLoader />;
  return (
    <>
      {results === undefined ? (
        <PostLoader numberOfSkeletons={3} />
      ) : (
        <Stack spacing={2}>
          {results?.map((post) => (
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
