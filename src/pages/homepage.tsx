import CommunityCreatePostLink from "@/components/Community/CommunityCreatePostLink";
import PersonalHome from "@/components/Community/PersonalHome";
import Premium from "@/components/Community/Premium";
import Recommendations from "@/components/Recommendations";
import PageLayout from "@/layout/pageLayout";
import { Stack } from "@chakra-ui/react";

export default function Homepage() {
  return (
    <PageLayout>
      <>
        <CommunityCreatePostLink />
        {/* {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post: Post, index) => (
              <PostItem
                key={post.id}
                post={post}
                postIdx={index}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={onSelectPost}
                homePage
              />
            ))}
          </Stack>
        )} */}
      </>
      <Stack spacing={5} position="sticky" top="14px">
        {/* <Recommendations /> */}
        <Premium />
        <PersonalHome />
      </Stack>
    </PageLayout>
  );
}
