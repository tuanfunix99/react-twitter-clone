import React, { useState } from "react";
import { Modal } from "flowbite-react";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);

  const setIsLoginHandler = (val: boolean) => {
    setIsLogin(val);
  };

  const setIsResetHandler = (val: boolean) => {
    setIsReset(val);
  };

  const onCloseHandler = () => {
    onClose();
    setIsLogin(true);
    setIsReset(false);
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onCloseHandler}>
      <Modal.Header />
      <Modal.Body>
        {isReset && (
          <ResetPassword
            setIsReset={setIsResetHandler}
            setIsLogin={setIsLoginHandler}
          />
        )}
        {!isReset && isLogin && (
          <Login
            setIsReset={setIsResetHandler}
            setIsLogin={setIsLoginHandler}
          />
        )}
        {!isReset && !isLogin && <Register setIsLogin={setIsLoginHandler} />}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
