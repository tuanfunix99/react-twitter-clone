import React from "react";
import { SparklesIcon } from "@heroicons/react/solid";
import { User } from "../base";
import Input from "./Input";
import Posts from "./post/Posts";

interface FeedProps {
  user: User | null;
}

const Feed = ({ user }: FeedProps) => {
  return (
    <div
      className="flex-grow border-l border-r border-gray-700 
    max-w-2xl"
    >
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg font-bold sm:text-xl">Home</h2>
        <div className="flex items-center justify-center ml-auto w-9 h-9 xl:px-0">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>

      <Input user={user} />
      <Posts user={user} />
    </div>
  );
};

export default Feed;
