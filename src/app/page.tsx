import React from "react";
import GameContainer from "./_components/GameContainer";

export default function page() {
  return (
    <div className="w-full h-screen  lg:flex flex-col lg:items-center lg:justify-center bg-gradient-to-r from-slate-900 to-slate-700">
     <h1 className="hidden lg:block text-white font-bold text-2xl pt-5">NEXT SNAKE GAME</h1>

      <GameContainer />
    </div>
  );
}
