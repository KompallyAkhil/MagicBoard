import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ResponsePanel = ({ responses, className }) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current && responses.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [responses]);
  
  return (
    <div className={cn("h-full w-full bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl p-4 md:p-6 flex flex-col", className)}>
      <div className="flex items-center mb-4">
        <div className="h-3 w-3 rounded-full bg-magicboard-red mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-magicboard-yellow mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-magicboard-green"></div>
        <h2 className="text-xl font-medium ml-4 text-white">Interpretations</h2>
      </div>
      
      {responses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-400">
          <p className="float-animation text-lg">Draw something to see the magic ✨</p>
          <p className="text-sm mt-2 text-gray-500">I'll try to interpret your drawing</p>
        </div>
      ) : (
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 staggered-children"
          style={{ scrollbarWidth: 'thin' }}
        >
          {responses.map((response, index) => (
            <div
              key={index}
              className={cn(
                "py-3 px-4 my-2 bg-gray-800/80 backdrop-blur-sm rounded-xl animate-fade-in transition-all duration-300 hover:bg-gray-700",
                response.success ? "border-l-2 border-magicboard-green" : "border-l-2 border-magicboard-red"
              )}
            >
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">#{index + 1}</span>
                <p className="text-white text-sm md:text-base">{response}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsePanel;

