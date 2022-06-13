import React, { useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import AlertCustom from "../../custom/Alert";
import { useAuth } from "react-hooks-firebase-v9";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsLogin: (val: boolean) => void;
  setIsReset: (val: boolean) => void;
}

const Login = ({ setIsLogin, setIsReset }: LoginProps) => {
  const [error, setError] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signInWithEAPCallback } = useAuth();

  const [signIn, { loading }] = signInWithEAPCallback();

  const onLoginHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    signIn({
      value: { email, password },
      onCompleted(data) {
        navigate("/", { replace: true });
      },
      onError(error) {
        setError({ message: error.message });
      },
    });
  };

  return (
    <div className="px-4 pb-2 space-y-4">
      <h3 className="text-xl font-medium text-white">Sign in</h3>
      {error && (
        <AlertCustom
          type="danger"
          content={error.message as string}
          title="Error"
        />
      )}
      <form className="flex flex-col gap-4" onSubmit={onLoginHandler}>
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
        <div className="flex justify-between">
          <a
            onClick={() => setIsReset(true)}
            className="text-sm text-blue-700 hover:underline dark:text-blue-500 cursor-pointer"
          >
            Lost Password?
          </a>
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
            {!loading && "Login"}
          </Button>
        </div>
      </form>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?{" "}
        <a
          onClick={() => setIsLogin(false)}
          className="text-blue-700 cursor-pointer hover:underline dark:text-blue-500"
        >
          Create account
        </a>
      </div>
    </div>
  );
};

export default Login;
