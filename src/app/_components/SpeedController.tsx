import React from "react";

interface Props {
  handleSpeedChange: (speed: number) => void;
  buttons: {
    label: string;
    color: string;
    speed?: number;
    onClick?: () => void;
  }[];
}

const SpeedController: React.FC<Props> = ({ handleSpeedChange, buttons }) => {
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
