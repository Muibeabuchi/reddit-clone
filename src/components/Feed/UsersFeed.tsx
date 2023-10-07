// import React from 'react'
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PostItem from "../Posts/PostItem";
import { Stack } from "@chakra-ui/react";
import PostLoader from "../Posts/PostLoader";
// import PaginatedFeed from "../InfiniteScroll/PaginatedFeed";

export default function UsersFeed() {
  const posts = useQuery(api.posts.getUsersFeed);

  //   console.log("homepage posts", results);
  //   console.log(status);

  const data = posts?.map((post) => (
    <PostItem
      key={post._id}
      // onDeletePost={onDeletePost}
      // onSelectPost={onSelectPost}
      // onVote={onVote}
      post={post}
      // votes={communityVotes.find((c) => c.postId === post._id)}
      // userIsCreator={user?.uid === post.creatorId}
    />
  ));
  return (
    <>
      {posts === undefined ? (
        <PostLoader numberOfSkeletons={3} />
      ) : (
        <Stack
        // id="lala"
        // overflowY="auto"
        // maxH="650px"
        // css={{
        //   "&::-webkit-scrollbar": {
        //     width: "0px",
        //   },
        //   "&::-webkit-scrollbar-track": {
        //     width: "0px",
        //   },
        //   "&::-webkit-scrollbar-thumb": {
        //     background: "transparent",
        //     borderRadius: "0px",
        //   },
        // }}
        >
          {data}
        </Stack>
      )}
    </>
  );
}
