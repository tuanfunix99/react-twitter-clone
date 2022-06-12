import React from "react";

interface DefaultAvatarProps {
  avaSize: string;
}

const DefaultAvatar = ({ avaSize }: DefaultAvatarProps) => {
  return (
    <div
      className={`${avaSize} relative overflow-hidden bg-gray-100 rounded-full flex items-center`}
    >
      <svg
        className="w-15 h-15 text-gray-400 mx-auto"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
};

export default DefaultAvatar;
