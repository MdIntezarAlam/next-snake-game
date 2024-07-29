import React from "react";

interface Props {
  handleSpeedChange: (speed: number) => void;
  isPaused: boolean;
  togglePause: () => void;
}

const SpeedController: React.FC<Props> = ({
  handleSpeedChange,
  isPaused,
  togglePause,
}) => {
  const buttons = [
    { speed: 300, label: "Slow", color: "bg-green-500" },
    { speed: 200, label: "Normal", color: "bg-yellow-500" },
    { speed: 100, label: "Fast", color: "bg-red-500" },
    {
      label: isPaused ? "Resume" : "Pause",
      color: "bg-purple-500",
      onClick: togglePause,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-4 bg-gradient-to-r from-yellow-200 to-pink-400 w-full h-[40px] gap-2 py-1 ">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`w-full text-sm rounded-full text-white font-bold ${button.color}`}
            type="button"
            onClick={
              button.onClick
                ? button.onClick
                : () => handleSpeedChange(button.speed!)
            }
          >
            {button.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default SpeedController;
