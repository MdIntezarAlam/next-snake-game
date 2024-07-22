"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react";
import bgImage from "@/public/bg-image.jpg";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from "react-icons/fa";

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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number>(0);

  const eatingSound = useRef<HTMLAudioElement | null>(null);
  const runningSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);

  const [gameSpeed, setGameSpeed] = useState(200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      eatingSound.current = new Audio("/eatingSound.mp3");
      runningSound.current = new Audio("/runningSound.mp3");
      gameOverSound.current = new Audio("/gameOverSound.mp3");

      setHighScore(Number(localStorage.getItem("highScore")) || 0);
      setBestTime(Number(localStorage.getItem("bestTime")) || 0);
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

    if (head[0] < 0 || head[0] >= columns || head[1] < 0 || head[1] >= rows) {
      setGameOver(true);
      setEndTime(Date.now());
      setTotalTime(Date.now() - (startTime ?? Date.now()));
      gameOverSound.current?.play();
      runningSound.current?.pause();
      runningSound.current!.currentTime = 0;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i][0] === head[0] && newSnake[i][1] === head[1]) {
        setGameOver(true);
        setEndTime(Date.now());
        setTotalTime(Date.now() - (startTime ?? Date.now()));
        gameOverSound.current?.play();
        runningSound.current?.pause();
        runningSound.current!.currentTime = 0;
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
        return;
      }
    }

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
  }, [direction, fruit, snake, startTime]);

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

        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(
          fruit[0] * scale + scale / 2,
          fruit[1] * scale + scale / 2,
          scale / 2,
          0,
          2 * Math.PI
        );
        context.fill();
      };
      bg.src = bgImage.src;
    }
  }, [snake, fruit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scale = 10;

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
        runningSound.current.currentTime = 0;
      }
    };
  }, [gameOver, gameSpeed, update, draw]);

  useEffect(() => {
    if (gameOver) {
      const currentScore = score;
      const currentTime = totalTime;
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem("highScore", String(currentScore));
      }
      if (currentTime < bestTime || bestTime === 0) {
        setBestTime(currentTime);
        localStorage.setItem("bestTime", String(currentTime));
      }
    }
  }, [gameOver, score, totalTime, highScore, bestTime]);

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
    setStartTime(Date.now());
    if (runningSound.current) {
      runningSound.current.play();
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      update();
      draw();
    }, gameSpeed);
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

  const handleDirectionChange = (
    newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT"
  ) => {
    if (
      (newDirection === "UP" && direction !== "DOWN") ||
      (newDirection === "DOWN" && direction !== "UP") ||
      (newDirection === "LEFT" && direction !== "RIGHT") ||
      (newDirection === "RIGHT" && direction !== "LEFT")
    ) {
      setDirection(newDirection);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  return (
    <div className="w-full sm:w-1/2 h-sc  flex flex-col gap-5 lg:py-4 items-center justify-center mx-auto bg-[#333232] rounded-md">
      <div className="w-full h-[50px] flex items-center bg-orange-300 px-4">
        <div className="flex-1 flex items-center gap-1">
          <button
            className="h-8 w-[20%] text-sm rounded-full bg-green-500 text-white"
            type="button"
            onClick={() => handleSpeedChange(300)}
          >
            Slow
          </button>
          <button
            className="h-8 w-[20%] text-sm rounded-full bg-yellow-500 text-white"
            type="button"
            onClick={() => handleSpeedChange(200)}
          >
            Normal
          </button>
          <button
            className="h-8 w-[20%] text-sm rounded-full bg-red-500 text-white"
            type="button"
            onClick={() => handleSpeedChange(100)}
          >
            Fast
          </button>
        </div>
      </div>
      <div className="w-full h-[50px] flex items-center bg-blue-300 px-4 justify-between">
        <span className="text-black">Score: {score}</span>
        <span className="text-black">High Score: {highScore}</span>
        <span className="text-black">Time: {formatTime(totalTime)}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black rounded-md relative"
        />

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

      <div className="flex flex-col gap-2 sm:hidden w-[70%] rounded-md p-2">
        {" "}
        <button
          className="min-h-20 min-w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full mx-auto"
          onClick={() => handleDirectionChange("UP")}
        >
          <FaChevronUp className="p-1" />
        </button>
        <div className="flex justify-between">
          <button
            className="min-h-20 min-w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full"
            onClick={() => handleDirectionChange("LEFT")}
          >
            <FaChevronLeft className="p-1" />
          </button>
          <button
            className="min-h-20 min-w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full"
            onClick={() => handleDirectionChange("RIGHT")}
          >
            <FaChevronRight className="p-1" />
          </button>
        </div>
        <button
          className="min-h-20 min-w-20 bg-gray-800 text-white flex items-center justify-center text-4xl rounded-full mx-auto"
          onClick={() => handleDirectionChange("DOWN")}
        >
          <FaChevronDown className="p-1" />
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
