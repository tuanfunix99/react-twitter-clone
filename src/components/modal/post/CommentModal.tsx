import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  XIcon,
} from "@heroicons/react/solid";
import { Post, User } from "../../../base";
import Picker from "../../custom/emoji/Picker";
import { useTransaction } from "react-hooks-firebase-v9";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";

interface CommenModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  post: Post;
  user: User | null;
  onCreated: () => void;
}

const CommentModal = ({ open, setOpen, user, post, onCreated }: CommenModalProps) => {
  const [comment, setComment] = useState<any>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const { onTransactionCallback, createCollection } = useTransaction();
  const [onTransaction, { loading }] = onTransactionCallback();

  const onSelectEmojiHandler = (emoji: string) => {
    setComment((pre: any) => (pre === null ? "" + emoji : pre + emoji));
  };

  const onCloseHandler = () => {
    setOpen(false);
    setShowEmojis(false);
    setComment(null);
  };

  const onReplyHandler = () => {
    onTransaction({
      async onRun({ firestore }) {
        const collection = createCollection(`comments`);
        await firestore.addDoc(collection, {
          postId: post.id,
          userId: user?.uid,
          displayName: user?.displayName,
          photoURL: user?.photoURL,
          comment: comment,
          createdAt: new Date(),
        });
        toast.success("Reply created", {
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true,
          theme: "colored",
        });
        onCreated();
        onCloseHandler();
      },
      onError() {
        toast.error("Can not create reply", {
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true,
          theme: "colored",
        });
      },
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 pt-8"
        onClose={onCloseHandler}
      >
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {showEmojis && (
            <Picker
              onSelectEmoji={(emoji: string) => onSelectEmojiHandler(emoji)}
              className="absolute top-80 left-100"
            />
          )}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={onCloseHandler}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={post.userPhotoURL as string}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                          {post?.userDisplayName}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                          {/* @{post?.tag}{" "} */}
                        </span>
                      </div>{" "}
                      <span className="hover:underline text-sm sm:text-[15px]">
                        {/* <Moment fromNow>{post?.timestamp?.toDate()}</Moment> */}
                      </span>
                      <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                        {post?.tweet}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex space-x-3 w-full">
                    <img
                      src={user?.photoURL as string}
                      alt="avatar"
                      className="h-11 w-11 rounded-full"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={comment ? comment : ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setComment(e.target.value)
                        }
                        placeholder="Tweet your reply"
                        className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />

                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                          <div className="icon rotate-90">
                            <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>

                          <div
                            className="icon"
                            onClick={() => setShowEmojis(!showEmojis)}
                          >
                            <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>

                          <div className="icon">
                            <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>
                        </div>
                        <button
                          className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                          type="submit"
                          onClick={onReplyHandler}
                          disabled={loading || !comment?.trim()}
                        >
                          {loading && (
                            <>
                              <div className="flex text-center">
                                <Spinner size="sm" light={true} />
                              </div>
                            </>
                          )}
                          {!loading && "Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommentModal;
