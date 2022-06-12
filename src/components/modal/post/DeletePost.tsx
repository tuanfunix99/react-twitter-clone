import React from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import { useTransaction } from "react-hooks-firebase-v9";
import { useRecoilState } from "recoil";
import { togglePostState } from "../../../states/post";

interface DeletePostModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  postId: string;
  isImagePost: boolean;
}

const DeletePost = ({
  open,
  setOpen,
  postId,
  isImagePost,
}: DeletePostModalProps) => {
  const { onTransactionCallback, createDocRef, createStorageRef } =
    useTransaction();
  const [onTransaction, { loading }] = onTransactionCallback();
  const [togglePost, setTogglePost] = useRecoilState(togglePostState);

  const onClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const onDeletePost = () => {
    onTransaction({
      async onRun({ firestore, storage }) {
        const doc = createDocRef("posts", postId);
        await firestore.deleteDoc(doc);
        if (isImagePost) {
          const ref = createStorageRef("post/" + postId);
          await storage.deleteFile(ref);
        }
        setOpen(false);
        setTogglePost(!togglePost);
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          {/* <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" /> */}
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this post?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="red" disabled={loading} onClick={onDeletePost}>
              {loading && (
                <>
                  <div className="mr-3">
                    <Spinner size="sm" light={true} />
                  </div>
                  Deleting...
                </>
              )}
              {!loading && "Yes, I'm sure"}
            </Button>
            <Button color="light" onClick={onClose} disabled={loading}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeletePost;
