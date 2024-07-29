/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import React from "react";

import { useRouter } from "next/navigation";
interface Props {
  score: number;
  highScore: number;
  totalTime: number;
  formatTime: (time: number) => string;
}
export default function GameHeader({
  score,
  formatTime,
  highScore,
  totalTime,
}: Props) {
  const router = useRouter();

  const scoreMap = [
    { title: "Score", score: score },
    { title: "High Score", score: highScore },
    { title: "Time", score: formatTime(totalTime) },
  ];
  return (
    <nav className="w-full h-[40px] bg-black text-white px-5 py-1 flex items-center justify-between lg:rounded-br-full lg:rounded-tl-full">
      {scoreMap.map((item, index) => (
        <span key={index} className="text-white font-medium lg:text-xl">
          {item.title}: {item.score}
        </span>
      ))}

      <div
        className="h-[35px] w-[35px] cursor-pointer"
        onClick={() => router.push("https://intezar-dev.netlify.app/")}
      >
        <img
          src="user.jpg"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    </nav>
  );
}
