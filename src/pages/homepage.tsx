import CommunityCreatePostLink from "@/components/Community/CommunityCreatePostLink";
import PersonalHome from "@/components/Community/PersonalHome";
import Premium from "@/components/Community/Premium";
import Recommendations from "@/components/Recommendations";
import PageLayout from "@/layout/pageLayout";
import { Stack } from "@chakra-ui/react";
// import { api } from "../../convex/_generated/api";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  // usePaginatedQuery,
} from "convex/react";
// import { useUser } from "@clerk/clerk-react";
// import PostLoader from "@/components/Posts/PostLoader";
// import PostItem from "@/components/Posts/PostItem";
// import PaginatedFeed from "@/components/InfiniteScroll/PaginatedFeed";
import HomeFeed from "@/components/Feed/HomeFeed";

export default function Homepage() {
  // fetch the paginated data

  return (
    <PageLayout>
      <>
        <CommunityCreatePostLink />
        <Unauthenticated>
          <HomeFeed />
        </Unauthenticated>
        <Authenticated>we are authenticated</Authenticated>
        {/* todo ------ add a custom banner or component that lets the user knows we are authenticating them */}
        <AuthLoading>Loading the Auth</AuthLoading>
      </>
      <Stack spacing={5} position="sticky" top="14px">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageLayout>
  );
}
