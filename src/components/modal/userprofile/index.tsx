import React, { Fragment, useEffect, useState } from "react";
import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import Avatar from "../../custom/avatar";
import { User } from "../../../base";
import { IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import CropImageModal from "../CropImage";
import {
  convertBase64,
  dataURLtoFile,
  handleDisplayName,
} from "../../../utils/handle";
import { useTransaction, useStorage } from "react-hooks-firebase-v9";

interface UserProfileModalProps {
  user: User | null;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const UserProfileModal = ({ open, setOpen, user }: UserProfileModalProps) => {
  const [photoURL, setPhotoURL] = useState<string>(user?.photoURL as string);
  const [displayName, setDisplayName] = useState<string>(
    user?.displayName as string
  );
  const [openCrop, setOpenCrop] = useState(false);
  const { onTransactionCallback, createStorageRef, createDocRef } =
    useTransaction();
  const [onTransaction, { loading }] = onTransactionCallback();
  const { deleteFileAsync } = useStorage();
  const [changeFile, setChangeFile] = useState(false);

  useEffect(() => {
    setPhotoURL(user?.photoURL as string);
    setDisplayName(user?.displayName as string);
  }, [user]);

  const onClose = () => {
    setOpen(false);
    setPhotoURL(user?.photoURL as string);
    setDisplayName(user?.displayName as string);
  };

  const getFile = (files: FileList | null) => {
    return files ? files[0] : null;
  };

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(e.target.files);
    if (file) {
      const base64 = await convertBase64(file);
      setChangeFile(true);
      setPhotoURL(base64 as string);
      setOpenCrop(true);
    }
  };

  const saveCropImage = (image: string) => {
    setPhotoURL(image);
  };

  const onUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onTransaction({
      async onRun({ storage, firestore }) {
        const ref = createStorageRef(("avatar/" + user?.uid) as string);
        let downloadURL: any = null;
        if (changeFile) {
          const { error } = await deleteFileAsync(ref);
          const fileImage = await dataURLtoFile(photoURL, "file name");
          downloadURL = await storage.uploadFile(ref, fileImage);
        }
        const doc = createDocRef("users", user?.uid as string);
        await firestore.updateDoc(doc, {
          displayName: handleDisplayName(displayName),
          photoURL: downloadURL ? downloadURL : user?.photoURL,
        });
        window.location.reload();
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  return (
    <Fragment>
      <CropImageModal
        open={openCrop}
        setOpen={(value: boolean) => setOpenCrop(value)}
        photoURL={photoURL}
        save={saveCropImage}
      />
      <Modal show={open} size="md" popup={true} onClose={onClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="px-6 pb-4 space-y-6 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Your profile
            </h3>
            <form onSubmit={onUpdateProfile}>
              <div className="relative">
                <Avatar photoURL={photoURL} size="xl" />
                <input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={onChangeFile}
                  disabled={loading}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className="bottom-0 left-20 absolute w-6 h-6 border-solid border-6 border-white rounded-full !important"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
              <div className="mt-4">
                <Label className="block mb-2" htmlFor="email">
                  Username
                </Label>
                <TextInput
                  id="displayName"
                  value={displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDisplayName(e.target.value)
                  }
                  required={true}
                  disabled={loading}
                />
              </div>
              <div className="w-full mt-4">
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <>
                      <div className="mr-3">
                        <Spinner size="sm" light={true} />
                      </div>
                      Handling ...
                    </>
                  )}
                  {!loading && "Save"}
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default UserProfileModal;
