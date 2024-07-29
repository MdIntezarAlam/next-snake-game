import React from "react";
import GameContainer from "./_components/GameContainer";

export default function page() {
  return (
    <div className="w-full h-screen  lg:flex lg:items-center lg:justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600 via-pink-600 to-blue-600">
      <GameContainer />
    </div>
  );
}
