/* eslint-disable jsx-a11y/alt-text */
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
import { useRouter } from "next/navigation";
import GameHeader from "./GameHeader";
import GameGround from "./GameGround";
import SpeedController from "./SpeedController";
import GameDirection from "./GameDirection";

const GameContainer = () => {
  const router = useRouter();
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
  const [isPaused, setIsPaused] = useState(false);
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
    if (isPaused) return;

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
  }, [direction, fruit, snake, startTime, isPaused]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const scale = 10;

    if (context) {
      const bg = new Image();
      bg.onload = () => {
        context.clearRect(0, 0, canvas!.width, canvas!.height);
        context.drawImage(bg, 0, 0, canvas!.width, canvas!.height);

        context.fillStyle = "white";
        snake.forEach(([x, y], index) => {
          if (index === 0) {
            // Draw the head as a circle
            context.beginPath();
            context.arc(
              x * scale + scale / 2,
              y * scale + scale / 2,
              scale / 2,
              0,
              2 * Math.PI
            );
            context.fill();
          } else {
            // Draw the body as rectangles
            context.fillRect(x * scale, y * scale, scale, scale);
          }
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
    const gameLoop = () => {
      if (!gameOver && !isPaused) {
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
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
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
  }, [gameOver, gameSpeed, update, draw, isPaused]);

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

  const togglePause = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
    if (isPaused) {
      runningSound.current?.play();
    } else {
      runningSound.current?.pause();
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  return (
    <div className="w-full h-full lg:h-fit lg:w-1/2 flex flex-col gap-2 m-auto bg-[#333232] rounded-md ">
      <GameHeader
        score={score}
        formatTime={formatTime}
        highScore={highScore}
        totalTime={totalTime}
      />
      <GameGround
        canvasRef={canvasRef}
        gameOver={gameOver}
        handleRestart={handleRestart}
      />
      <SpeedController
        handleSpeedChange={handleSpeedChange}
        isPaused={isPaused}
        togglePause={togglePause}
      />
      <GameDirection handleDirectionChange={handleDirectionChange} />
    </div>
  );
};

export default GameContainer;
