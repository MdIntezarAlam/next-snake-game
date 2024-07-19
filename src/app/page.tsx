import React from "react";
import SnakeGame from "@/app/_components/SnakeGame";

const page = () => {
  return (
    <main className="flex flex-col gap-5 items-center justify-center w-full min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white">Snake Game</h1>
      <SnakeGame />
    </main>
  );
};

export default page;
