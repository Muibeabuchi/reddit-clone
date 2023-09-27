// import React, { useEffect } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { useRouter } from "next/router";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { Post } from "../../../../atoms/postsAtom";
// import About from "../../../../components/Community/About";
// import Comments from "../../../../components/Post/Comments";
// import PostLoader from "../../../../components/Post/Loader";
// import PostItem from "../../../../components/Post/PostItem";
// import { auth, firestore } from "../../../../firebase/clientApp";
// import useCommunityData from "../../../../hooks/useCommunityData";
// import usePosts from "../../../../hooks/usePosts";

import PageLayout from "@/layout/pageLayout";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { Id } from "convex/_generated/dataModel";
import PostLoader from "@/components/Posts/PostLoader";
import PostItem from "@/components/Posts/PostItem";
import Comments from "@/components/Posts/Comments";
import CommunityAbout from "@/components/Community/CommunityAbout/CommunityAbout";

// type PostPageProps = {};

const PostPage = () => {
  // get the page params
  const { communityName, postId } = useParams();
  const post = useQuery(api.posts.getSinglePost, {
    postId: postId as Id<"posts">,
  });

  const communityData = useQuery(api.community.getCommunityData, {
    communityName: communityName as string,
  });

  if (!communityData) return;
  console.log(post?.postVotes);
  return (
    <PageLayout>
      {/* Left Content */}
      <>
        {post === undefined ? (
          // todo --- create a loader for single page post
          <PostLoader />
        ) : (
          <>
            {/* {postStateValue.selectedPost && ( */}
            <>
              <PostItem
                post={post}
                // votes={post.postVotes.find(vote => vote.voterId === )}

                // post={postStateValue.selectedPost}
                // // postIdx={postStateValue.selectedPost.postIdx}
                // onVote={onVote}
                // onDeletePost={onDeletePost}
                // userVoteValue={
                //   postStateValue.postVotes.find(
                //     (item) => item.postId === postStateValue.selectedPost!.id
                //   )?.voteValue
                // }
                // userIsCreator={
                //   user?.uid === postStateValue.selectedPost.creatorId
                // }
                // router={router}
              />
              {/* <Comments
                user={user}
                community={community as string}
                selectedPost={postStateValue.selectedPost}
              /> */}
            </>
            {/* )}  */}
          </>
        )}
      </>
      {/* Right Content */}
      <>
        <CommunityAbout
          communityData={communityData}

          // communityData={

          //   // communityStateValue.currentCommunity
          //   // communityStateValue.visitedCommunities[community as string]
          // }
          // loading={loading}
        />
      </>
    </PageLayout>
  );
};
export default PostPage;
