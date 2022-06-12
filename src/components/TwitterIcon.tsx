import React from "react";

interface TwitterIconProps {
  width: number;
  height: number;
}

const TwitterIcon = ({ width, height }: TwitterIconProps) => {
  return (
    <img
      src="/images/twitter-icon.jpg"
      alt="twitter icon"
      width={width}
      height={height}
    />
  );
};

export default TwitterIcon;
