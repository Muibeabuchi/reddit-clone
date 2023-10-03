import { atom } from "recoil";

const defaultState: boolean = false;

export const createCommunityModal = atom({
  key: "createCommunityModal",
  default: defaultState,
});
