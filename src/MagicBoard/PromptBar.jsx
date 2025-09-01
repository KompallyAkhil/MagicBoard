import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from "sonner";

const PromptBar = ({ canvasRef, onImageGenerated, clearCanvas }) => {
   const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const placeholder = "Describe what you want me to create from your sketch...";
  const disabled = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      let image = null;

      // ✅ Always export latest canvas image
      if (canvasRef?.current) {
        image = await canvasRef.current.exportImage(); // gives base64
      }

      const response = await axios.post("http://localhost:5000/generate-image-prompt", {
        prompt: message.trim(),
        image,
      });


      if (response.data.success) {
        toast.success("Image generated successfully!");
        // Pass the generated image data to parent component
        if (onImageGenerated) {
          onImageGenerated({
            type: 'image',
            imageUrl: response.data.imageUrl,
            enhancedPrompt: response.data.enhancedPrompt,
            originalPrompt: response.data.originalPrompt,
            timestamp: new Date().toISOString()
          });
        }
        // Clear both prompt and canvas after successful generation
        setMessage('');
        if (clearCanvas) {
          clearCanvas();
        }
      } else {
        toast.error(response.data.error || "Failed to generate.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Server error, please try again.");
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex items-end justify-center pointer-events-none">
      <form onSubmit={handleSubmit} className="relative w-full max-w-xl mb-6 pointer-events-auto">
        <div
          className={`relative flex items-end bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-[var(--shadow-elegant)] transition-all duration-200 ease-out 
          ${isFocused ? 'shadow-[var(--shadow-focus)]' : ''} ${disabled ? 'opacity-60' : ''}`}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 resize-none border-0 bg-transparent px-12 py-4 text-sm text-white placeholder:text-muted-foreground 
                       focus:outline-none min-h-[48px] max-h-[200px] leading-6"
            rows={1}
          />

          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            disabled={!canSend}
            className={`absolute right-3 bottom-3 h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
              canSend
                ? 'bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptBar;
