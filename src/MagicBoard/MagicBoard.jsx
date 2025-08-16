import React, { useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useRef, useState } from "react";
import ResponsePanel from './ResponsePanel';
import ColorPalette from './ColorPalette';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from 'axios';
import "../index.css";

export default function MagicBoard() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("white");
  const [isEraser, setIsEraser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [drawing, setDrawing] = useState();
  const [dataToSpeak, setDataToSpeak] = useState();
  const [strokeWidth, setStrokeWidth] = useState(5);
  const handleColorChange = (color) => {
    setCurrentColor(color);
    setIsEraser(false);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };
  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };
  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };
  async function interPretDrawing() {
    if (canvasRef.current) {
      setIsLoading(true);
      const canvaImage = canvasRef.current;
      const image = await canvaImage.exportImage();
      setDrawing(image);
      try {
        const response = await axios.post("https://magic-board-backend.vercel.app/solve", { image });
        const text = response.data;
        setResponses((prev) => [...prev, text.answer]);
        setDataToSpeak(text.answer);
        setIsLoading(false);
        clearCanvas();
        toast.success("Drawing interpreted!", {
          description: "Check the response panel to see the result."
        });
      } catch (error) {
        setIsLoading(false);
      }
    }
  }
  useEffect(() => {
    if (dataToSpeak) {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(dataToSpeak);

        const voices = synth.getVoices();
        const preferredVoice = voices.find(voice =>
          voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        synth.speak(utterance);
      }
    }
  }, [dataToSpeak]);
  function clearCanvas() {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  }

  return (
    <>
      <Toaster richColors />
      <div className="w-full min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-10 tracking-tight reveal-animation">
          Magic Board
          <span className="ml-2 inline-block animate-pulse-light">✨</span>
        </h1>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 fade-slide-in flex flex-col md:flex-row items-center justify-between gap-4">
            <ColorPalette
              currentColor={currentColor}
              isEraser={isEraser}
              onColorChange={handleColorChange}
              onEraserToggle={toggleEraser}
            />
            <div className='flex items-center gap-3'>
              <label className='text-sm text-gray-300'>Stroke</label>
              <input type='range' min='1' max='100' value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className='slider' />
              <span className='text-sm text-gray-300'>{strokeWidth}px</span>
              <button className='px-3 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium 
                         transition-all duration-300 ease-in-out transform hover:scale-105 
                         hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 focus:outline-none' onClick={handleUndoClick}>Undo</button>
              <button className='px-3 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium 
                         transition-all duration-300 ease-in-out transform hover:scale-105 
                         hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 focus:outline-none' onClick={handleRedoClick} >Redo</button>
            </div>
            <div className='flex gap-4'>
              <button
                onClick={interPretDrawing}
                className="px-3 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium 
                         transition-all duration-300 ease-in-out transform hover:scale-105 
                         hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 focus:outline-none"
              >
                Interpret Drawing
              </button>
              <button
                onClick={clearCanvas}
                className="px-3 md:px-6 py-2 md:py-3 rounded-full bg-gray-800 text-white font-medium 
                         transition-all duration-300 ease-in-out transform hover:scale-105 
                         hover:shadow-lg hover:shadow-gray-500/20 active:scale-95 focus:outline-none"
              >
                Clear Canvas
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <div className="lg:col-span-2 xl:col-span-3 fade-slide-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-full bg-black rounded-2xl shadow-2xl border-2 border-gray-800 overflow-hidden h-[70vh] min-h-[500px]">
                <ReactSketchCanvas
                  ref={canvasRef}
                  strokeWidth={strokeWidth}
                  height='100%'
                  width='100%'
                  canvasColor='black'
                  eraserWidth={isEraser ? 20 : 0}
                  strokeColor={isEraser ? "black" : currentColor}
                />
              </div>
            </div>
            <div className="fade-slide-in h-[70vh]  min-h-[300px]" style={{ animationDelay: "0.3s" }}>
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
  );
}
