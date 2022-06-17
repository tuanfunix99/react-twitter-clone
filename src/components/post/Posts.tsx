import React, { Fragment, useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useFireStore } from "react-hooks-firebase-v9";
import { useRecoilState, useRecoilValue } from "recoil";
import { Post, User } from "../../base";
import { postsState, togglePostState } from "../../states/post";
import { mapToPost } from "../../utils/handle";
import PostExplore from "./PostExplore";
import { LIMIT_PAGE } from "../../constants";

interface PostsProps {
  user: User | null;
}

const Posts = ({ user }: PostsProps) => {
  const { queryPaginationCallback, createCollection, mapToDocumentData } =
    useFireStore();
  const [queryPosts, { loading }] = queryPaginationCallback();
  const [loadMorePost, { loading: loadingMore }] = queryPaginationCallback();
  const [posts, setPosts] = useRecoilState(postsState);
  const togglePost = useRecoilValue(togglePostState);
  const [endPage, setEndpage] = useState(false);

  if (!localStorage.getItem("page")) {
    localStorage.setItem("page", "1");
  }

  useEffect(() => {
    const collection = createCollection("posts");
    localStorage.removeItem("page");
    localStorage.setItem("page", "1");
    queryPosts({
      collection,
      pagination: {
        page: 1,
        limit: LIMIT_PAGE,
        orderBy: [["createdAt", "desc"]],
        // where: [["userId", "==", user?.uid]]
      },
      onCompleted(data) {
        const postDocs = mapToDocumentData<Omit<Post, "id">>(data.docs);
        const posts = mapToPost(postDocs);
        setPosts(posts);
        if (posts.length <= LIMIT_PAGE) {
          setEndpage(true);
          return;
        }
        setEndpage(false);
      },
      onError(error) {
        console.log(error.message);
        setPosts([]);
      },
    });
  }, [togglePost, user]);

  const displayPosts = () => {
    if (posts.length > 0) {
      return posts.map((post, key) => {
        return <PostExplore post={post} key={key} user={user} />;
      });
    } else {
      return (
        <div className="my-5 text-xl text-center text-white">
          No post found.
        </div>
      );
    }
  };

  const onLoadMorePost = () => {
    const page = parseInt(localStorage.getItem("page") as string) + 1;
    const collection = createCollection("posts");
    if (!endPage) {
      loadMorePost({
        collection,
        pagination: {
          page: page,
          limit: LIMIT_PAGE,
          orderBy: [["createdAt", "desc"]],
        },
        onCompleted(data) {
          const postDocs = mapToDocumentData<Omit<Post, "id">>(data.docs);
          const posts = mapToPost(postDocs);
          setPosts((pre) => [...pre, ...posts]);
          if (posts.length <= LIMIT_PAGE) {
            setEndpage(true);
            return;
          }
          localStorage.setItem("page", page.toString());
        },
      });
    }
  };

  console.log(endPage);

  return (
    <Fragment>
      {loading && (
        <div className="flex flex-col justify-center mt-2 text-center">
          <Spinner />
        </div>
      )}
      {!loading && (
        <Fragment>
          <div>{displayPosts()}</div>
          <div className="flex justify-center my-5 text-center">
            {loadingMore && <Spinner />}
            {!loadingMore && !endPage && posts.length > 0 && (
              <Button color="dark" outline={true} onClick={onLoadMorePost}>
                Load more post
              </Button>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Posts;
