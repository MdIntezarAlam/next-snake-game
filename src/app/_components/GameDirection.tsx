import React from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from "react-icons/fa";

interface Props {
  handleDirectionChange: (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => void;
}
export default function GameDirection({ handleDirectionChange }: Props) {
  return (
    <div className="lg:hidden flex flex-col w-[65%] mx-auto">
      <button
        className="h-20 w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full mx-auto"
        onClick={() => handleDirectionChange("UP")}
      >
        <FaChevronUp className="p-1" />
      </button>
      <div className="flex justify-between">
        <button
          className="h-20 w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full"
          onClick={() => handleDirectionChange("LEFT")}
        >
          <FaChevronLeft className="p-1" />
        </button>
        <button
          className="h-20 w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full"
          onClick={() => handleDirectionChange("RIGHT")}
        >
          <FaChevronRight className="p-1" />
        </button>
      </div>
      <button
        className="h-20 w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full mx-auto"
        onClick={() => handleDirectionChange("DOWN")}
      >
        <FaChevronDown className="p-1" />
      </button>
    </div>
  );
}
