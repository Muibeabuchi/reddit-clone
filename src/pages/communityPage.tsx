// import { Community, communitiesState } from "@/atoms/communitiesAtom";
import CommunityHeader from "@/components/Community/CommunityHeader";
import PageLayout from "@/layout/pageLayout";
import CommunityCreatePostLink from "@/components/Community/CommunityCreatePostLink";
import Posts from "@/components/Posts/Posts";
import CommunityAbout from "@/components/Community/CommunityAbout/CommunityAbout";
// import { useRecoilState, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostLoader from "@/components/Posts/PostLoader";
import { Id } from "convex/_generated/dataModel";

export type CommunityPostsAndVotes = {
  _id: Id<"posts">;
  _creationTime: number;
  communityImageUrl?: string | undefined;
  communityName: string;
  authorId: Id<"profile">;
  authorName: string;
  communityId: Id<"community">;
  numberOfComments: number;
  numberOfVotes: number;
  postBody: string;
  postImageId: string;
  postTitle: string;
  postVotes: postVotes;
};
export type postVotes = {
  communityId: Id<"community">;
  communityName: string;
  postId: Id<"posts">;
  voteStatus: -1 | 1;
  voterId: Id<"profile">;
  _creationTime: number;
  _id: Id<"votes">;
}[];

const CommunityPage = () => {
  const params = useParams();
  const communityName = params.communityName!;

  // const communityPosts = useQuery(api.posts.getCommunityPosts, {
  //   communityName,
  // });
  const communityData = useQuery(api.community.getCommunityData, {
    communityName,
  });

  // console.log(communityPosts);

  if (!communityData) return;

  return (
    <>
      <CommunityHeader
        communityData={communityData}
        communityName={communityName}
      />
      <PageLayout>
        <>
          <CommunityCreatePostLink communityName={communityName} />
          <Posts
            communityName={communityName}
            // communityPosts={communityPosts}
            // communityVotes={communityVotes}
          />
        </>
        <>
          <CommunityAbout communityData={communityData} />
        </>
      </PageLayout>
    </>
  );
};

export default CommunityPage;
