import PageLayout from "@/layout/pageLayout";
import NewPostForm from "@/components/Posts/NewPostForm";
import PostHeading from "@/components/Posts/PostForm/PostHeading";

import { useParams } from "react-router-dom";
import CommunityAbout from "@/components/Community/CommunityAbout/CommunityAbout";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, Flex, VStack } from "@chakra-ui/react";

// type SubmitPageProps = {
//   params: {
//     communitypage: string;
//   };
// };

const SubmitPage = () => {
  const { communityName } = useParams();
  // console.log(communityName);
  // const communityData = await getCommunityData(communitypage);
  // if (!communityData || communityData == null) {
  //   notFound();
  // }

  const communityData = useQuery(api.community.getCommunityData, {
    communityName: communityName as string,
  });

  if (!communityData) return;
  return (
    <PageLayout>
      <>
        {/* <Flex direction="column" gap="20px" width={"100%"}> */}
        <PostHeading />
        <NewPostForm communityName={communityName} />
        {/* <Box display={["block", "none"]}>
          <CommunityAbout communityData={communityData} />
        </Box> */}
        {/* </Flex> */}
      </>
      <>
        <CommunityAbout communityData={communityData} />
      </>
    </PageLayout>
  );
};

export default SubmitPage;
