// import { Post } from "@/atoms/PostsAtom";
import PostItem from "./PostItem";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";
import { Doc } from "convex/_generated/dataModel";

type PostsProps = {
  communityPosts: Doc<"posts">[] | undefined;
  communityVotes: Doc<"votes">[];
};

const Posts = ({
  communityPosts,
  communityVotes,
}: PostsProps): React.ReactNode => {
  // const { postStateValue, setPostValue, onDeletePost, onSelectPost, onVote } =
  //   usePosts();communityPosts

  if (!communityPosts) return <PostLoader />;
  return (
    <>
      {!communityPosts ? (
        <PostLoader />
      ) : (
        <Stack spacing={2}>
          {communityPosts?.map((post) => (
            <PostItem
              key={post._id}
              // onDeletePost={onDeletePost}
              // onSelectPost={onSelectPost}
              // onVote={onVote}
              post={post}
              votes={communityVotes.find((c) => c.postId === post._id)}
              // userIsCreator={user?.uid === post.creatorId}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
