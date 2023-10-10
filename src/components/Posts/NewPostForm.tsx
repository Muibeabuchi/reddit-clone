import { Flex, Icon } from "@chakra-ui/react";
import * as React from "react";
// import { BiPoll } from "react-icons/bi";
// import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
// import { Post } from "@/atoms/PostsAtom";
// import PostErrorAlert from "./PostErrorAlert";
import useSelectFile from "@/hooks/useSelectFile";
// import { useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import useCreatePostImage from "@/hooks/useCreatePostImage";

interface IAppProps {
  communityName: string | undefined;
}

const formTabs: tabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images",
    icon: IoImageOutline,
  },
  // {
  //   title: "Link",
  //   icon: BsLink45Deg,
  // },
  // {
  //   title: "Talk",
  //   icon: BsMic,
  // },
  // {
  //   title: "Poll",
  //   icon: BiPoll,
  // },
];

export type tabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FunctionComponent<IAppProps> = ({ communityName }) => {
  const navigate = useNavigate();
  const mutation = useMutation(api.posts.createPost);
  const [selectedTab, setSelectedTab] = React.useState(formTabs[0].title);
  const [textInputs, setTextInputs] = React.useState({
    title: "",
    body: "",
  });
  const { setSelectedFile, selectedFile, onSelectImage } = useSelectFile();
  const { setPostImage, postImage, handleCreatePostImage } =
    useCreatePostImage();
  const [loading, setLoading] = React.useState(false);
  // const [error, setError] = React.useState(false);
  function onTextChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setTextInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleCreatePost() {
    if (!textInputs.title) return;
    // console.log("creating the post");
    if (!communityName) return;
    setLoading(true);

    try {
      const postImageId = await handleCreatePostImage();
      await mutation({
        communityName,
        numberOfVotes: 0,
        postBody: textInputs.body,
        postTitle: textInputs.title,
        postImageId: postImageId ? postImageId : "",
      });
      setTextInputs({
        body: "",
        title: "",
      });
      navigate(`/r/${communityName}`);
    } catch (error) {
      // console.log("creating post error", error);ww
      // setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex direction="column" bg="white" mt={2} borderRadius={4}>
      {/* <> */}
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Images" && (
          <ImageUpload
            postImage={postImage}
            selectedFile={selectedFile}
            onSelectImage={onSelectImage}
            setSelectedTab={setSelectedTab}
            setPostImage={setPostImage}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {/* <NewPostForm /> */}
      {/* {error && <PostErrorAlert />} */}
    </Flex>
  );
};

export default NewPostForm;
