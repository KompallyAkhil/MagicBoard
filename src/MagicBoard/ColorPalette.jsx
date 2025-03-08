import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintbrush, faEraser } from "@fortawesome/free-solid-svg-icons";

const ColorPalette = ({
  currentColor,
  isEraser,
  onColorChange,
  onEraserToggle,
}) => {
  const colorOptions = [
    { color: "white", tailwindColor: "bg-magicboard-white", label: "White" },
    { color: "red", tailwindColor: "bg-magicboard-red", label: "Red" },
    { color: "green", tailwindColor: "bg-magicboard-green", label: "Green" },
    { color: "yellow", tailwindColor: "bg-magicboard-yellow", label: "Yellow" },
    { color: "skyblue", tailwindColor: "bg-magicboard-skyblue", label: "Sky Blue" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {colorOptions.map(({ color, tailwindColor, label }) => (
       <button
       key={color}
       onClick={() => onColorChange(color)}
    
       className={`magic-color-button group w-12 h-12 rounded-full ${tailwindColor} ${
         currentColor === color && !isEraser ? "ring-2 ring-white" : ""
       } transition-transform duration-300 transform group-hover:scale-110`}
     >     
          <FontAwesomeIcon 
            icon={faPaintbrush} 
            className={`
              "h-5 w-5 text-gray-900 transition-transform duration-300 group-hover:rotate-12 hover:scale-110",
              ${currentColor === color && !isEraser && "animate-bounce-once"}
            )`}
          />
        </button>
      ))}
      
      <button
        onClick={onEraserToggle}
        aria-label="Toggle eraser tool"
        className={`magic-color-button w-12 h-12 rounded-full bg-gray-200 ${
          isEraser && "ring-2 ring-white"}
        `}
      >
        <FontAwesomeIcon 
          icon={faEraser} 
          className={`
            "h-8 w-8 text-gray-900 transition-transform duration-300",
            ${isEraser && "animate-bounce-once"}
          )`}
        />
      </button>
    </div>
  );
};

export default ColorPalette;

