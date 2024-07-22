import React from "react";
import SnakeGame from "@/app/SnakeGame";

const page = () => {
  return (
    <main className="flex flex-col gap-3 items-center lg:justify-center w-full min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white py-3">Snake Game</h1>
      <SnakeGame />
    </main>
  );
};

export default page;
