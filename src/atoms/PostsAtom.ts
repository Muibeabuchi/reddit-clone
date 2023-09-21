import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL: string;
  createdAt: Timestamp;
};

export type postVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postvotes: postVote[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postvotes: [],
};

export const postState = atom<PostState>({
  key: "poststate",
  default: defaultPostState,
});
