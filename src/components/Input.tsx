import React, { useState, useRef } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/solid";
import { User } from "../base";
import Picker from "./custom/emoji/Picker";
import { convertBase64, dataURLtoFile } from "../utils/handle";
import CropImageModal from "./modal/CropImage";
import { Spinner } from "flowbite-react";
import { useTransaction } from "react-hooks-firebase-v9";
import { useRecoilState } from "recoil";
import { togglePostState } from "../states/post";

interface InputProps {
  user: User | null;
}

const Input = ({ user }: InputProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [tweet, setTweet] = useState<any>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [togglePost, setTogglePost] = useRecoilState(togglePostState);

  const {
    onTransactionCallback,
    createStorageRef,
    createDocRef,
    createCollection,
  } = useTransaction();
  const [onTransaction, { loading }] = onTransactionCallback();

  const onSelectEmojiHandler = (emoji: string) => {
    setTweet((pre: any) => (pre === null ? "" + emoji : pre + emoji));
  };

  const getFile = (files: FileList | null) => {
    return files ? files[0] : null;
  };

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFile(e.target.files);
    if (file) {
      const base64 = await convertBase64(file);
      setPhotoURL(base64 as string);
      setOpenCrop(true);
    }
  };

  const saveCropImage = (image: string) => {
    setSelectedFile(image);
  };

  const onPostHandler = () => {
    onTransaction({
      async onRun({ storage, firestore }) {
        const collection = createCollection("posts");
        const newDoc = {
          tweet,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user?.uid,
          userPhotoURL: user?.photoURL,
          userDisplayName: user?.displayName,
          userEmail: user?.email,
        };
        const postDoc = await firestore.addDoc(collection, newDoc);
        let downloadURL: any = null;
        if (selectedFile) {
          const ref = createStorageRef("post/" + postDoc.id);
          const fileImage = await dataURLtoFile(photoURL, "file name");
          downloadURL = await storage.uploadFile(ref, fileImage);
          const doc = createDocRef("posts", postDoc.id);
          await firestore.updateDoc(doc, {
            postImage: downloadURL,
            updatedAt: new Date(),
          });
        }
        setTogglePost(!togglePost);
        setSelectedFile(null);
        setPhotoURL("");
        setTweet("");
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  return (
    <div className={`border-b border-gray-700 p-3 flex space-x-3`}>
      <CropImageModal
        open={openCrop}
        setOpen={(value: boolean) => setOpenCrop(value)}
        photoURL={photoURL}
        save={saveCropImage}
      />
      <img
        src={user?.photoURL as string}
        alt="avatar"
        className="hidden rounded-full cursor-pointer md:flex h-11 w-11"
      />
      <div className="w-full divide-y divide-gray-700">
        <div className={`${selectedFile && "mb-7"}`}>
          <textarea
            value={tweet ? tweet : ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setTweet(e.target.value)
            }
            placeholder="What's happening?"
            disabled={loading}
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          />

          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  setPhotoURL("");
                }}
              >
                <XIcon className="h-5 text-white" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="object-contain rounded-2xl max-h-80"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5">
          <div className="flex items-center relative">
            <div
              className="icon"
              onClick={() => filePickerRef.current?.click()}
            >
              <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
              <input
                accept="image/*"
                type="file"
                ref={filePickerRef}
                onChange={onChangeFile}
                hidden
                disabled={loading}
              />
            </div>

            <div className="rotate-90 icon">
              <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
              <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div className="icon">
              <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            {showEmojis && (
              <Picker
                onSelectEmoji={(emoji: string) => onSelectEmojiHandler(emoji)}
                className="absolute top-10 left-0"
              />
            )}
          </div>
          <button
            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
            disabled={loading || !tweet?.trim()}
            onClick={onPostHandler}
          >
            {loading && (
              <>
                <div className="flex text-center">
                  <Spinner size="sm" light={true} />
                </div>
              </>
            )}
            {!loading && "Tweet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
