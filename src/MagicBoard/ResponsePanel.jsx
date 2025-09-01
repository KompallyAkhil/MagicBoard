import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "../index.css";
import ReactMarkdown from "react-markdown";
import { Download, Image as ImageIcon } from "lucide-react";
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

  const downloadImage = async (imageDataUrl, filename) => {
    try {
      const a = document.createElement('a');
      a.href = imageDataUrl;
      a.download = filename || 'generated-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl p-4 md:p-6 flex flex-col" >
      <div className="flex items-center mb-4">
        <div className="h-3 w-3 rounded-full bg-magicboard-red mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-magicboard-yellow mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-magicboard-green"></div>
        <h2 className="text-xl font-medium ml-4 text-white">Results</h2>
      </div>
      <div className="flex-1 min-h-[200px] flex flex-col">
        {responses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-400">
            <p className="float-animation text-lg">Draw something to see the magic ✨</p>
            <p className="text-sm mt-2 text-gray-500">I'll interpret your drawing or generate images from prompts</p>
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
                  response.type === 'image' ? "border-l-4 border-purple-500" : 
                  (response.success !== false ? "border-l-4 border-magicboard-green" : "border-l-4 border-magicboard-red")
                )}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-sm text-gray-400 font-semibold">#{index + 1}</span>
                  <div className="flex-1">
                    {response.type === 'image' ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-400 mb-3">
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-base font-semibold">AI Generated Artwork</span>
                        </div>
                        
                        <div className="relative group">
                          <img 
                            src={response.imageUrl} 
                            alt="Generated artwork"
                            className="w-full h-auto max-h-96 object-contain rounded-xl shadow-2xl border border-gray-700 hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div className="hidden text-red-400 text-sm bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                            ❌ Failed to load image
                          </div>
                          
                          {/* Overlay with download button on hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                            <button
                              onClick={() => downloadImage(response.imageUrl, `magicboard-artwork-${index + 1}.png`)}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                              <Download className="h-4 w-4" />
                              Download Image
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Original Prompt</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed pl-4">
                              "{response.originalPrompt}"
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">AI Enhanced</span>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed pl-4">
                              "{response.enhancedPrompt}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                            Generated with Stability AI
                          </div>
                          <button
                            onClick={() => downloadImage(response.imageUrl, `magicboard-artwork-${index + 1}.png`)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-medium rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Download className="h-3 w-3" />
                            Save Artwork
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white text-sm md:text-base">
                        <ReactMarkdown>{response}</ReactMarkdown> 
                      </p>
                    )}
                  </div>
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
