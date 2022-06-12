import { atom } from "recoil";
import { Post } from "../base";

export const postsState = atom<Post[]>({
  key: "posts",
  default: [],
});

export const togglePostState = atom<boolean>({
  key: "created",
  default: false,
})