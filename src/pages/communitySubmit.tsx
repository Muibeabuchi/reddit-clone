import PageLayout from "@/layout/pageLayout";
import NewPostForm from "@/components/Posts/NewPostForm";
import PostHeading from "@/components/Posts/PostForm/PostHeading";

import { useParams } from "react-router-dom";

// type SubmitPageProps = {
//   params: {
//     communitypage: string;
//   };
// };

const SubmitPage = () => {
  const { communityName } = useParams();
  console.log(communityName);
  // const communityData = await getCommunityData(communitypage);
  // if (!communityData || communityData == null) {
  //   notFound();
  // }
  return (
    <PageLayout>
      <>
        <PostHeading />
        <NewPostForm communityName={communityName} />
      </>
      <>right side</>
    </PageLayout>
  );
};

export default SubmitPage;
