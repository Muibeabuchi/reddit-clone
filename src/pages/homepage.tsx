import CommunityCreatePostLink from "@/components/Community/CommunityCreatePostLink";
import PersonalHome from "@/components/Community/PersonalHome";
import Premium from "@/components/Community/Premium";
import Recommendations from "@/components/Recommendations";
import PageLayout from "@/layout/pageLayout";
import { Stack } from "@chakra-ui/react";
import { api } from "../../convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import PostLoader from "@/components/Posts/PostLoader";
import PostItem from "@/components/Posts/PostItem";
import PaginatedFeed from "@/components/InfiniteScroll/PaginatedFeed";

export default function Homepage() {
  const { user } = useUser();
  // fetch the paginated data

  const { results, loadMore, isLoading, status } = usePaginatedQuery(
    api.posts.getHomepageFeedUnauthenticated,
    {
      userAuthToken: user?.id,
    },
    {
      initialNumItems: 15,
    }
  );

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
    <PageLayout>
      <>
        <CommunityCreatePostLink />
        {status === "LoadingFirstPage" ? (
          <PostLoader numberOfSkeletons={3} />
        ) : (
          <Stack>
            <PaginatedFeed
              data={data}
              hasMore={status === "CanLoadMore"}
              fetchData={() => loadMore(10)}
              // scrollableTarget="scrollableContainer"
            />
          </Stack>
        )}
      </>
      <Stack spacing={5} position="sticky" top="14px">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageLayout>
  );
}
