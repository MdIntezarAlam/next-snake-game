"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react";
import bgImage from "@/public/bg-image.jpg";

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<number[][]>([
    [10, 10],
    [10, 11],
    [10, 12],
  ]);
  const [fruit, setFruit] = useState<number[]>([15, 15]);
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">(
    "UP"
  );
  const intervalRef = useRef<number | null>(null);

  const eatingSound = useRef<HTMLAudioElement | null>(null);
  const runningSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);

  const [gameSpeed, setGameSpeed] = useState(200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      eatingSound.current = new Audio("/eatingSound.mp3");
      runningSound.current = new Audio("/runningSound.mp3");
      gameOverSound.current = new Audio("/gameOverSound.mp3");
    }
  }, []);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = 10;
    const rows = Math.floor(canvas.height / scale);
    const columns = Math.floor(canvas.width / scale);

    const newSnake = [...snake];
    const head = [...newSnake[0]];

    switch (direction) {
      case "UP":
        head[1] -= 1;
        break;
      case "DOWN":
        head[1] += 1;
        break;
      case "LEFT":
        head[0] -= 1;
        break;
      case "RIGHT":
        head[0] += 1;
        break;
    }

    newSnake.unshift(head);

    // Check if the snake has hit the boundaries of the canvas
    if (head[0] < 0 || head[0] >= columns || head[1] < 0 || head[1] >= rows) {
      setGameOver(true);
      gameOverSound.current?.play();
      runningSound.current?.pause();
      runningSound.current!.currentTime = 0;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Check if the snake has collided with itself
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i][0] === head[0] && newSnake[i][1] === head[1]) {
        setGameOver(true);
        gameOverSound.current?.play();
        runningSound.current?.pause();
        runningSound.current!.currentTime = 0;
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
        return;
      }
    }

    // Check if the snake has eaten the fruit
    if (head[0] === fruit[0] && head[1] === fruit[1]) {
      setScore((prevScore) => prevScore + 1);
      setFruit([
        Math.floor(Math.random() * columns),
        Math.floor(Math.random() * rows),
      ]);
      eatingSound.current?.play();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [direction, fruit, snake]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const scale = 10;

    if (context) {
      const bg = new Image();
      bg.onload = () => {
        context.clearRect(0, 0, canvas!.width, canvas!.height);
        context.drawImage(bg, 0, 0, canvas!.width, canvas!.height);
        context.fillStyle = "green";
        snake.forEach(([x, y]) => {
          context.fillRect(x * scale, y * scale, scale, scale);
        });

        context.fillStyle = "red";
        context.fillRect(fruit[0] * scale, fruit[1] * scale, scale, scale);
      };
      bg.src = bgImage.src;
    }
  }, [snake, fruit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scale = 10; // Adjust as needed

    const gameLoop = () => {
      if (!gameOver) {
        update();
        draw();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    intervalRef.current = window.setInterval(gameLoop, gameSpeed);
    if (runningSound.current) {
      runningSound.current.loop = true;
      runningSound.current.play();
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("keydown", handleKeyDown);
      if (runningSound.current) {
        runningSound.current.pause();
        runningSound.current.currentTime = 0; // Reset sound position
      }
    };
  }, [gameOver, gameSpeed, update, draw]);

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setSnake([
      [10, 10],
      [10, 11],
      [10, 12],
    ]);
    setFruit([15, 15]);
    setDirection("UP");
    if (runningSound.current) {
      runningSound.current.play();
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      update();
      draw();
    }, gameSpeed); // Use gameSpeed for interval
  };

  const handleSpeedChange = (speed: number) => {
    setGameSpeed(speed);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      update();
      draw();
    }, speed);
  };

  return (
    <div className="w-1/2 flex flex-col gap-5 py-4 items-center justify-center mx-auto bg-[#333232] rounded-md">
      <div className="w-full h-[50px] flex items-center bg-orange-300 px-4">
        <div className="flex-1 flex items-center gap-1">
          <button
            className="h-8 w-[20%] text-sm rounded-full bg-green-500 text-white"
            onClick={() => handleSpeedChange(300)}
          >
            Slow
          </button>
          <button
            className="h-8 w-[20%] text-sm rounded-full bg-yellow-500 text-white"
            onClick={() => handleSpeedChange(200)}
          >
            Normal
          </button>
          <button
            className="h-8 w-[20%] text-sm rounded-full bg-[#774343] text-white"
            onClick={() => handleSpeedChange(100)}
          >
            Fast
          </button>
          <div className="text-2xl">Score: {score}</div>
        </div>
        <div className="flex items-center justify-end h-[45px] w-[45px]">
          <img
            src="/user.jpg"
            alt="user"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-5 bg-[#3d3536] px-4">
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          className="border-2 border-black"
        />
        {gameOver && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="text-2xl text-white">Score: {score}</div>
            <p className="text-xl text-red-500">Game Over!</p>
            <button
              className="w-full py-2 bg-blue-500 text-white rounded"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
