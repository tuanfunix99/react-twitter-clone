import React, { Fragment } from "react";
import DefaultAvatar from "./DefaultAvatar";
import UserAvatar from "./UserAvatar";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  photoURL: string | null | undefined;
  size: AvatarSize;
}

const Avatar = ({ photoURL, size }: AvatarProps) => {
  const mapSize = new Map<AvatarSize, string>();
  
  mapSize.set("sm", "w-10 h-10");
  mapSize.set("sm", "w-12 h-12");
  mapSize.set("md", "w-16 h-16");
  mapSize.set("lg", "w-24 h-24");
  mapSize.set("xl", "w-28 h-28");

  return (
    <Fragment>
      {!photoURL && <DefaultAvatar avaSize={mapSize.get(size) as string} />}
      {photoURL && (
        <UserAvatar photoURL={photoURL} avaSize={mapSize.get(size) as string} />
      )}
    </Fragment>
  );
};

export default Avatar;
