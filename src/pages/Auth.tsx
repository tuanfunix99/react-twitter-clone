import { useState } from "react";
import { useTransaction } from "react-hooks-firebase-v9";
import AuthModal from "../components/modal/auth";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleDisplayName } from "../utils/handle";
import TwitterIcon from "../components/TwitterIcon";

function Login() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const { onTransactionCallback, auth: a, createDocRef } = useTransaction();
  const [onTransaction, { loading }] = onTransactionCallback();

  const onLoginGoogleHandler = () => {
    onTransaction({
      async onRun({ auth, firestore }) {
        const user = await auth.signInWithProvider(a, "google", "popup");
        const doc = createDocRef("users", user.uid);
        const docData = await firestore.getDoc(doc);
        if (!docData.exists()) {
          await firestore.setDoc(doc, {
            displayName: handleDisplayName(user.displayName as string),
            photoURL: user.photoURL,
          });
        }
        navigate("/", { replace: true });
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  const onOpenModal = () => {
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex flex-col items-center space-y-20">
      <ToastContainer />
      <AuthModal open={openModal} onClose={onCloseModal} />
      <TwitterIcon width={150} height={150} />
      <div className="space-y-5 flex flex-col">
        <button
          className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
          disabled={loading}
          onClick={onLoginGoogleHandler}
        >
          <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
          <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
            Sign in with Google
          </span>
        </button>
        <button
          className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
          disabled={loading}
          onClick={onOpenModal}
        >
          <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
          <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
            Sign in with Email
          </span>
        </button>
      </div>
    </div>
  );
}

export default Login;
