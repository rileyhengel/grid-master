import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DICTIONARY } from '../constants/dictionary';

export default function InfoTip({ termKey, label }) {
  const text = DICTIONARY[termKey];
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, renderBelow: false });
  const triggerRef = useRef(null);

  if (!text) return <span>{label}</span>;

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      // THE FIX: Check if we are too close to the ceiling (e.g., less than 150px)
      const isTooHigh = rect.top < 150; 

      setCoords({
        // If too high, anchor to the bottom of the word. Otherwise, anchor to the top.
        top: isTooHigh ? rect.bottom : rect.top,
        left: rect.left + (rect.width / 2),
        renderBelow: isTooHigh
      });
      
      setIsVisible(true);
    }
  };

  // The Clamp: Prevent the 256px (w-64) tooltip from flying off the monitor edges
  let safeLeft = coords.left;
  if (typeof window !== 'undefined') {
    safeLeft = Math.max(140, Math.min(window.innerWidth - 140, coords.left));
  }

  return (
    <span 
      onMouseLeave={() => setIsVisible(false)} 
      className="relative inline-flex items-center"
    >
      {/* The Target Word */}
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        className="border-b border-dashed border-gray-500 hover:text-green-400 hover:border-green-400 transition-colors cursor-help inline-block ml-1"
      >
        {label}
      </span>
      
      {/* The Portal: Renders at the <body> level to escape all layout clipping */}
      {isVisible && typeof document !== 'undefined' && createPortal(
        <div 
          // Dynamically swap the translation and padding based on where we are rendering!
          className={`fixed -translate-x-1/2 w-64 z-[9999] pointer-events-none transition-transform ${
            coords.renderBelow ? 'pt-2' : '-translate-y-full pb-2'
          }`}
          style={{ top: coords.top, left: safeLeft }}
        >
          <div className="p-3 bg-gray-800 border border-gray-600 shadow-2xl rounded-sm">
            <strong className="text-green-400 block mb-1 uppercase tracking-wider text-[10px] border-b border-gray-700 pb-1">
              {label}
            </strong>
            <p className="text-gray-300 text-xs leading-relaxed font-sans m-0">
              {text}
            </p>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}