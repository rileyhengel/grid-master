import React from 'react';
import { useGrid } from '../context/GridContext';

export default function StartScreen() {
  const { startGame, startTutorial, setIsManualOpen } = useGrid();

  return (
    <div className="absolute inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center font-mono text-white">
      <div className="max-w-2xl w-full p-10 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-green-400 mb-2">GRID MASTER</h1>
        <h2 className="text-2xl tracking-widest text-gray-400 mb-12 uppercase">The Path to Net Zero</h2>
        
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <button 
            onClick={startGame}
            className="py-4 px-8 bg-green-700 hover:bg-green-600 text-white font-bold tracking-widest transition-colors uppercase"
          >
            New Game
          </button>
          <button 
            onClick={startTutorial}
            className="py-4 px-8 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white font-bold tracking-widest transition-colors uppercase"
          >
            Tutorial
          </button>
          {/* THE FIX: Replaced the dead settings button with the Codex trigger */}
          <button 
            onClick={() => setIsManualOpen(true)}
            className="py-4 px-8 bg-blue-900 border border-blue-700 hover:bg-blue-800 text-white font-bold tracking-widest uppercase transition-colors"
          >
            Operations Manual
          </button>
        </div>
      </div>
    </div>
  );
}