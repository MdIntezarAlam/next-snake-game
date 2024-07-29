import React from "react";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameOver: boolean;
  handleRestart: () => void;
}
export default function GameGround({
  canvasRef,
  gameOver,
  handleRestart,
}: Props) {
  return (
    <div className="relative  mx-auto">
      <canvas ref={canvasRef} width={400} height={400} className="responsive"/>
      {gameOver && (
        <div className="absolute top-10 w-full h-full flex flex-col items-center justify-center gap-4">
          <span className="text-white font-bold text-2xl">Game Over!</span>
          <button
            className="h-8 w-[90%] text-sm rounded-full bg-red-900 text-white"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
