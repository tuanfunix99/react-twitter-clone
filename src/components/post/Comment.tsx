import React, { Fragment, useEffect, useState } from "react";
import { ChatIcon } from "@heroicons/react/solid";
import CommentModal from "../modal/post/CommentModal";
import { Post, User } from "../../base";
import { useFireStore } from "react-hooks-firebase-v9";

interface CommentProps {
  post: Post;
  user: User | null;
}

const Comment = ({ post, user }: CommentProps) => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(0);
  const { createCollection, queryDocCallback } = useFireStore();
  const [queryComments] = queryDocCallback();
  const [createdToggle, setCreatedToggle] = useState(false);

  useEffect(() => {
    const collection = createCollection("comments");
    queryComments({
      collection,
      constraints: {
        where: [["postId", "==", post.id]],
      },
      onCompleted(data) {
        setComments(data.docs.length);
      },
    });
  }, [createdToggle]);

  return (
    <Fragment>
      <CommentModal
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        user={user}
        post={post}
        onCreated={() => setCreatedToggle(!createdToggle)}
      />
      <div
        className="flex items-center space-x-1 group"
        onClick={() => setOpen(true)}
      >
        <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
          <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
        </div>
        {comments > 0 && (
          <span className="group-hover:text-[#1d9bf0] text-sm">{comments}</span>
        )}
      </div>
    </Fragment>
  );
};

export default Comment;
