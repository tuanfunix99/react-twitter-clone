import React from "react";
import { Spinner } from "flowbite-react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col text-center justify-center items-center h-screen w-screen">
      <Spinner size="xl" />
    </div>
  );
};

export default LoadingPage;
