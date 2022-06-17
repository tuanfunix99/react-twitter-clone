import React, { useEffect, useState } from "react";
import {
  HeartIcon,
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/solid";
import { Post, User } from "../../base";
import { useTransaction } from "react-hooks-firebase-v9";
import { toast } from "react-toastify";

interface LikePostProps {
  post: Post;
  user: User | null;
}

interface Like {
  id: string;
  displayName: string;
}

const Like = ({ post, user }: LikePostProps) => {
  const [liked, setLiked] = useState(false);
  const { onTransactionCallback, createDocRef, createCollection } =
    useTransaction();
  const [onLikePost] = onTransactionCallback();
  const [fetchLikes] = onTransactionCallback();
  const [likes, setLikes] = useState<Like[] | null>(null);

  useEffect(() => {
    fetchLikes({
      async onRun({ firestore }) {
        const col = createCollection(`posts/${post.id}/likes`);
        const snapshot = await firestore.query(col, {});
        const likeDocs = firestore.mapToDocumentData<Omit<Like, "id">>(
          snapshot.docs
        );
        const likeArray: Like[] = likeDocs.map((like) => {
          return { id: like.id, displayName: like.data.displayName };
        });
        setLikes(likeArray);
      },
    });
    if (likes) {
      const like = likes.find((like) => like.id === user?.uid);
      if (like) {
        setLiked(true);
      }
    }
  }, [user, likes]);

  const onLikePostHandler = () => {
    onLikePost({
      async onRun({ firestore }) {
        setLiked(!liked);
        const doc = createDocRef(
          `posts/${post.id}`,
          "likes",
          user?.uid as string
        );
        if (liked) {
          await firestore.deleteDoc(doc);
        } else {
          await firestore.setDoc(doc, {
            displayName: user?.displayName,
          });
        }
      },
      onError() {
        setLiked(false);
        toast.error(`Error: Can not ${liked ? "unlike" : "like"} post.`, {
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true,
          theme: "colored",
        });
      },
    });
  };

  return (
    <div
      className="flex items-center space-x-1 group"
      onClick={onLikePostHandler}
    >
      <div className="icon group-hover:bg-pink-600/10">
        {liked ? (
          <HeartIconFilled className="h-5 text-pink-600" />
        ) : (
          <HeartIcon className="h-5 group-hover:text-pink-600" />
        )}
      </div>
      {likes && (
        <span
          className={`group-hover:text-pink-600 text-sm ${
            liked && "text-pink-600"
          }`}
        >
          {likes.length}
        </span>
      )}
    </div>
  );
};

export default Like;
