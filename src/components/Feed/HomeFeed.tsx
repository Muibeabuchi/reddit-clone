// import React from 'react'

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PostItem from "../Posts/PostItem";
import { Stack } from "@chakra-ui/react";
import PostLoader from "../Posts/PostLoader";
import PaginatedFeed from "../InfiniteScroll/PaginatedFeed";

export default function HomeFeed() {
  const { results, loadMore, isLoading, status } = usePaginatedQuery(
    api.posts.getHomepageFeedUnauthenticated,
    {
      //   userAuthToken: user?.id,
    },
    {
      initialNumItems: 15,
    }
  );

  // console.log("homepage posts", results);
  // console.log(status);

  const data = results?.map((post) => (
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
      {status === "LoadingFirstPage" ? (
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
          <PaginatedFeed
            data={data}
            hasMore={status === "CanLoadMore"}
            fetchData={() => loadMore(10)}
            // scrollableTarget="lala"
          />
        </Stack>
      )}
    </>
  );
}
