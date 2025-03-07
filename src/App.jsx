import React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useRef, useState } from "react";
import ResponsePanel from './ResponsePanel';
import ColorPalette from './ColorPalette';
import axios from 'axios';
import "./index.css"
export default function App() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("white");
  const [isEraser, setIsEraser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [drawing, setDrawing] = useState();
  const handleColorChange = (color) => {
    setCurrentColor(color);
    setIsEraser(false);
  }
  const toggleEraser = () => {
    setIsEraser(!isEraser);
  }
  async function interPretDrawing() {
    if (canvasRef.current) {
      setIsLoading(true);
      const canvaImage = canvasRef.current;
      const image = await canvaImage.exportImage();
      setDrawing(image);
      try {
        const response = await axios.post("http://localhost:5000/solve",{image});
        const text = response.data;
        setResponses((prev) => [...prev,text.answer])
        setIsLoading(false);
        clearCanvas();
      } catch (error) {
        setIsLoading(false)
        console.error("Error submitting the canvas image:", error);
      }
    }
  }
  function clearCanvas(){
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  }
  return (
    <>
      <div className="w-full  bg-black text-white p-4 md:p-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-10 tracking-tight">
          Magic Board
          <span className="ml-2 inline-block" style={{ animation: "pulse-light 1.5s ease-in-out infinite" }}>✨</span>
        </h1>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 fade-slide-in flex flex-col md:flex-row items-center md:justify-between gap-4">
            <ColorPalette
              currentColor={currentColor}
              isEraser={isEraser}
              onColorChange={handleColorChange}
              onEraserToggle={toggleEraser}
            />
            <div className='flex gap-4'>
              <button className="px-3 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium 
                         transition-all duration-300 ease-in-out transform hover:scale-105 
                         hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 focus:outline-none"
                onClick={interPretDrawing}
              >
                Interpret Drawing
              </button>
              <button className="px-3 md:px-6 py-2 md:py-3 rounded-full bg-gray-800 text-white font-medium 
                         transition-all duration-300 ease-in-out transform hover:scale-105 
                         hover:shadow-lg hover:shadow-gray-500/20 active:scale-95 focus:outline-none" 
                         onClick={clearCanvas}
                         >Clear</button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex gap-x-6 fade-slide-in">
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={5}
              height='510px'
              width='90%'
              borderRadius="12px"
              canvasColor='black'
              eraserWidth={15}
              strokeColor={isEraser ? "white" : currentColor}
            />
            <div className="fade-slide-in h-[70vh] min-h-[300px]" style={{ animationDelay: "0.3s" }}>
              <ResponsePanel responses={responses} />
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="p-6 bg-gray-900 rounded-xl flex flex-col items-center">
            <div className="animate-pulse-light mb-3">
              <div className="h-8 w-8 border-4 border-magicboard-skyblue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white">Interpreting your drawing...</p>
          </div>
        </div>
      )}
    </>
  )
}
