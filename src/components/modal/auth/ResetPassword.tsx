import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import AlertCustom from "../../custom/Alert";
import { useAuth } from "react-hooks-firebase-v9";
import { toast } from "react-toastify";

interface ResetPasswordProps {
  setIsLogin: (val: boolean) => void;
  setIsReset: (val: boolean) => void;
}

const ResetPassword = ({ setIsLogin, setIsReset }: ResetPasswordProps) => {
  const [error, setError] = useState<any>(null);
  const [email, setEmail] = useState("");
  const { sendPasswordResetEmailCallback } = useAuth();
  const [sendMail, { loading }] = sendPasswordResetEmailCallback();

  const onBacktoLogin = () => {
    setIsReset(false);
    setIsLogin(true);
  };

  const onResetPasswordHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    sendMail({
      email: email,
      onCompleted() {
        toast.success("Please check your email to reset password", {
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true,
          theme: "colored",
        });
        onBacktoLogin();
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
      <h3 className="text-xl font-medium text-white">Reset password</h3>
      {error && (
        <AlertCustom
          type="danger"
          content={error.message as string}
          title="Error"
        />
      )}
      <form className="flex flex-col gap-4" onSubmit={onResetPasswordHandler}>
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
        <div className="w-full">
          <Button type="submit" disabled={loading}>
            {loading && (
              <>
                <div className="mr-3">
                  <Spinner size="sm" light={true} />
                </div>
                Sending ...
              </>
            )}
            {!loading && "Send"}
          </Button>
        </div>
      </form>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        <a
          onClick={onBacktoLogin}
          className="text-blue-700 cursor-pointer hover:underline dark:text-blue-500"
        >
          Back to login
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;
