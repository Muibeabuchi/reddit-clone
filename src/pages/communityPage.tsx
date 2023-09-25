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

// type CommunityPageProps = {
// };

const CommunityPage = () => {
  const params = useParams();
  const communityName = params.communityName!;

  const communityPosts = useQuery(api.posts.getCommunityPosts, {
    communityName,
  });
  const communityVotes = useQuery(api.votes.getCommunityVotes, {
    communityName,
  });
  const communityData = useQuery(api.community.getCommunityData, {
    communityName,
  });

  console.log(communityData);

  if (!communityData) return;
  if (!communityVotes) return;

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
            communityPosts={communityPosts}
            communityVotes={communityVotes}
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
