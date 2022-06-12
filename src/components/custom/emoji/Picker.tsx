import React from "react";

import emojis from "./emoji.json";

interface PickerProps {
  onSelectEmoji: (val: string) => void;
}

const Picker = ({ onSelectEmoji }: PickerProps) => {
  const displayEmojis = () => {
    return emojis.map((emoji, key) => {
      return (
        <div onClick={() => onSelectEmoji(emoji.value)} key={key} className="text-3xl mx-1 my-1 cursor-pointer">
          {emoji.value}
        </div>
      );
    });
  };
  return (
    <div
      className={`z-50 flex flex-wrap w-[280px] h-[250px] overflow-y-scroll bg-black absolute top-52 left-10}`}
    >
      {displayEmojis()}
    </div>
  );
};

export default Picker;
