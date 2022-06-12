import React, { useState } from "react";
import { Modal } from "flowbite-react";
import Login from "./Login";
import Register from "./Register";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const setIsLoginHandler = (val: boolean) => {
    setIsLogin(val);
  };

  return (
    <Modal
      show={open}
      size="md"
      popup={true}
      onClose={onClose}
    >
      <Modal.Header />
      <Modal.Body>
        {isLogin && <Login setIsLogin={setIsLoginHandler} />}
        {!isLogin && <Register setIsLogin={setIsLoginHandler} />}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
