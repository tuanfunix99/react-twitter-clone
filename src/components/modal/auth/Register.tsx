import React, { useState } from "react";
import { Button, FileInput, Label, Spinner, TextInput } from "flowbite-react";
import { useTransaction } from "react-hooks-firebase-v9";
import AlertCustom from "../../custom/Alert";
import { toast } from "react-toastify";
import { convertBase64, dataURLtoFile, handleDisplayName } from "../../../utils/handle";
import CropImageModal from "../CropImage";

interface RegisterProps {
  setIsLogin: (val: boolean) => void;
}

const Register = ({ setIsLogin }: RegisterProps) => {
  const [error, setError] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [openCrop, setOpenCrop] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>("");

  const {
    onTransactionCallback,
    auth: au,
    createDocRef,
    createStorageRef
  } = useTransaction();
  const [create, { loading }] = onTransactionCallback();

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
    setPhotoURL(image);
  };

  const onCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    create({
      async onRun({ firestore, auth, storage }) {
        const user = await auth.createUserWithEAP(au, email, password.trim());
        const ref = createStorageRef("avatar/" + user.uid);
        const fileImage = await dataURLtoFile(photoURL, "file name");
        const downloadURL = await storage.uploadFile(ref, fileImage);
        const doc = createDocRef("users", user.uid);
        await firestore.setDoc(doc, {
          displayName: handleDisplayName(displayName),
          photoURL: downloadURL,
          email: user.email
        });
        await auth.sendEmailVerification(au);
        setIsLogin(true);
        toast.success("Please check your email to verify", {
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true,
          theme: "colored",
        });
      },
      onError(error) {
        setError({
          message: error.message,
        });
      },
    });
  };

  return (
    <div className="px-4 pb-2 space-y-4">
      <CropImageModal
        open={openCrop}
        setOpen={(value: boolean) => setOpenCrop(value)}
        photoURL={photoURL}
        save={saveCropImage}
      />
      <h3 className="text-xl font-medium text-white"> Create new account</h3>
      {error && (
        <AlertCustom
          type="danger"
          content={error.message as string}
          title="Error"
        />
      )}
      <form onSubmit={onCreateAccount} className="flex flex-col gap-4">
        <div>
          <Label className="block mb-2" htmlFor="email">
            Username
          </Label>
          <TextInput
            id="email"
            placeholder="user123"
            type="text"
            required={true}
            disabled={loading}
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
          />
        </div>
        <div>
          <Label className="block mb-2" htmlFor="email">
            Your email
          </Label>
          <TextInput
            id="email"
            placeholder="name@company.com"
            type="email"
            required={true}
            disabled={loading}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>
        <div>
          <Label className="block mb-2" htmlFor="password">
            Your password
          </Label>
          <TextInput
            id="password"
            type="password"
            required={true}
            disabled={loading}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <div>
          <Label className="block mb-2" htmlFor="confirm">
            Avatar
          </Label>
          <FileInput
            id="confirm"
            accept="image/*"
            required={true}
            disabled={loading}
            onChange={onChangeFile}
          />
        </div>
        <div className="w-full">
          <Button type="submit" disabled={loading}>
            {loading && (
              <>
                <div className="mr-3">
                  <Spinner size="sm" light={true} />
                </div>
                Handling ...
              </>
            )}
            {!loading && "Create"}
          </Button>
        </div>
      </form>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Have an account?{" "}
        <a
          onClick={() => setIsLogin(true)}
          className="text-blue-700 cursor-pointer hover:underline dark:text-blue-500"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default Register;
