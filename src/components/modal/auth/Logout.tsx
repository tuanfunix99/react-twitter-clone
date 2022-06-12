import React from "react";
import { Button, Modal } from "flowbite-react";
import { useAuth } from "react-hooks-firebase-v9";
import { useNavigate } from "react-router-dom";
import TwitterIcon from "../../TwitterIcon";

interface LogoutProps {
  open: boolean;
  setOpen(value: boolean): void;
}

const LogoutModal = ({ open, setOpen }: LogoutProps) => {
  const navigate = useNavigate();
  const { signOutCallback } = useAuth();
  const [signOut] = signOutCallback();

  const onClose = () => {
    setOpen(false);
  };

  const onLogoutHandler = () => {
    signOut({
      onCompleted() {
        navigate("/login", { replace: true });
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
          <div className="flex justify-center mb-2">
            <TwitterIcon width={50} height={50} />
          </div>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Log out of Twitter?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="light" onClick={onLogoutHandler}>
              Log out
            </Button>
            <Button color="light" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogoutModal;
