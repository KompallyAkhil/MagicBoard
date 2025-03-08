import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "../index.css";
import ReactMarkdown from "react-markdown";
const ResponsePanel = ({ responses, className }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && responses.length > 0) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", 
      });
    }
  }, [responses]);

  return (
    <div className="h-full w-full bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl p-4 md:p-6 flex flex-col" >
      <div className="flex items-center mb-4">
        <div className="h-3 w-3 rounded-full bg-magicboard-red mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-magicboard-yellow mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-magicboard-green"></div>
        <h2 className="text-xl font-medium ml-4 text-white">Interpretations</h2>
      </div>
      <div className="flex-1 min-h-[200px] flex flex-col">
        {responses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-400">
            <p className="float-animation text-lg">Draw something to see the magic ✨</p>
            <p className="text-sm mt-2 text-gray-500">I'll try to interpret your drawing</p>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex-1 overflow-auto pr-2 staggered-children custom-scrollbar"
          >
            {responses.map((response, index) => (
              <div
                key={index}
                className={cn(
                  "py-3 px-4 my-2 bg-gray-800/80 backdrop-blur-sm rounded-xl transition-all duration-300 hover:bg-gray-700 shadow-md",
                  response.success ? "border-l-4 border-magicboard-green" : "border-l-4 border-magicboard-red"
                )}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 font-semibold">#{index + 1}</span>
                  <p className="text-white text-sm md:text-base">
                  <ReactMarkdown>{response}</ReactMarkdown> 
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;
