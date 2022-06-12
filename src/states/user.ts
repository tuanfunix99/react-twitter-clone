import { atom } from "recoil";
import { User } from "../base";

const initialUser: User | null = null;

export const userState = atom<User | null>({
  key: "user",
  default: initialUser,
});
