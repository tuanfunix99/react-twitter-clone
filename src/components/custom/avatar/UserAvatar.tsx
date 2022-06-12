import React from "react";

interface UserAvatarProps {
  photoURL: string;
  avaSize: string;
}

const UserAvatar = ({ photoURL, avaSize }: UserAvatarProps) => {
  return (
    <img
      className={`${avaSize} rounded-full`}
      src={photoURL}
      alt="Rounded avatar"
    />
  );
};

export default UserAvatar;
