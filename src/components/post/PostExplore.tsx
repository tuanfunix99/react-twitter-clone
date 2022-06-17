import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  DotsHorizontalIcon,
  ShareIcon,
  HeartIcon as HeartIconFilled,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { Post, User } from "../../base";
import { ListGroup } from "flowbite-react";
import DeletePost from "../modal/post/DeletePost";
import Like from "./Like";
import Comment from "./Comment";

interface PostExploreProps {
  post: Post;
  user: User | null;
}

const PostExplore = ({ post, user }: PostExploreProps) => {
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const openDeleteModelHandler = () => {
    setOpenDeleteModel(true);
    setShowMenu(false);
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      // onClick={() => router.push(`/${id}`)}
    >
      <DeletePost
        open={openDeleteModel}
        setOpen={(value: boolean) => setOpenDeleteModel(value)}
        postId={post.id}
        isImagePost={!!post.postImage}
      />
      {/* {!postPage && (
        <img
          src={post?.userImg}
          alt=""
          className="h-11 w-11 rounded-full mr-4"
        />
      )} */}
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex">
          <img
            src={post?.userPhotoURL as string}
            alt="Profile Pic"
            className="h-11 w-11 rounded-full mr-4"
          />
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline`}
              >
                {post?.userDisplayName}
              </h4>
              <span className={`text-sm sm:text-[15px]`}>
                {/* @{post?.tag} */}
              </span>
            </div>
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              {/* <Moment fromNow>{post?.timestamp?.toDate()}</Moment> */}
            </span>
            <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
              {post?.tweet}
            </p>
          </div>
          <div className="icon group flex-shrink-0 ml-auto relative">
            <DotsHorizontalIcon
              className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="w-32 text-center absolute top-8 right-1">
                <ListGroup>
                  {user?.uid === post?.userId && (
                    <ListGroup.Item onClick={openDeleteModelHandler}>
                      Delete Post
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </div>
            )}
          </div>
        </div>

        {/* {postPage && (
          <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
        )} */}

        {post?.postImage && (
          <img
            src={post.postImage as string}
            alt=""
            className="rounded-2xl max-h-[700px] object-cover mr-2"
          />
        )}
        <div className={`text-[#6e767d] flex justify-between w-10/12`}>
          
          <Comment post={post} user={user} />

          <div className="flex items-center space-x-1 group">
            <div className="icon group-hover:bg-green-500/10">
              <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
            </div>
          </div>

          <Like post={post} user={user} />

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostExplore;
