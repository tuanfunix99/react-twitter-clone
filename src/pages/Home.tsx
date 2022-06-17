import React, { Fragment, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import LoadingPage from "../components/LoadingPage";
import { useRecoilState } from "recoil";
import { userState } from "../states/user";
import Feed from "../components/Feed";
import { Route, Routes, useNavigate } from "react-router-dom";
import { handleDisplayName } from "../utils/handle";
import { useTransaction } from "react-hooks-firebase-v9";
import { User } from "../base";
import { ToastContainer } from "react-toastify";
import Widgets from "../components/Widgets";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  const { onTransactionCallback, auth: au, createDocRef } = useTransaction();

  const [onTransaction, { loading }] = onTransactionCallback();

  useEffect(() => {
    onTransaction({
      async onRun({ auth, firestore }) {
        const data = await auth.getAuth(au);
        if (!data) {
          navigate("/login", { replace: true });
        } else {
          if (!data.emailVerified) {
            await auth.signOut(au);
            navigate("/login", { replace: true });
          }
          const doc = createDocRef("users", data.uid);
          const docData = await firestore.getDoc(doc);
          const { data: user, id } =
            firestore.convertToDocumentData<User>(docData);
          setUser({
            uid: id,
            displayName: handleDisplayName(user.displayName as string),
            photoURL: user.photoURL ? user.photoURL : null,
            email: user?.email,
          });
        }
      },
      onError() {
        navigate("/login", { replace: true });
      },
    });
  }, []);

  return (
    <Fragment>
      <ToastContainer />
      {loading && <LoadingPage />}
      {!loading && (
        <main className="bg-black flex max-w-[1500px] mx-auto h-full">
          <Sidebar user={user} />
          <Routes>
            <Route path="/" element={<Feed user={user} />} />
          </Routes>
          <Widgets />
        </main>
      )}
    </Fragment>
  );
};

export default Home;
