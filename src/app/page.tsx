import React from "react";
import SnakeGame from "./_components/SnakeGame";

export default function page() {
  return (
    <main className="flex flex-col gap-5 items-center justify-center w-full min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white">Snake Game</h1>
      <SnakeGame />
    </main>
  );
}
