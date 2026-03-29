import React from 'react';
import { useGrid } from '../context/GridContext';

export default function StartScreen() {
  const { startGame, startTutorial, setIsManualOpen } = useGrid();

  return (
    <div className="absolute inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center font-mono text-white">
      <div className="max-w-3xl w-full p-10 text-center">
        <h1 className="text-6xl font-bold tracking-tighter text-green-400 mb-2">GRID MASTER</h1>
        <h2 className="text-xl tracking-widest text-gray-400 mb-8 uppercase border-b border-gray-800 pb-8">Municipal Energy Simulator</h2>
        
        <div className="bg-gray-900 border border-gray-800 p-8 rounded text-left mb-12 shadow-2xl">
          <p className="text-gray-300 mb-6 leading-relaxed">
            Welcome to the control room, Director. You have been appointed to manage the municipal power grid for the next 30 years. 
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-green-400 font-bold mb-2 uppercase tracking-widest">Your Goal (Win)</h3>
              <ul className="text-gray-400 list-disc pl-5 space-y-1">
                <li>Survive the full 30-year simulation.</li>
                <li>Reach 0.00 Carbon Emissions.</li>
                <li>Keep lifetime blackouts under 12.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-red-400 font-bold mb-2 uppercase tracking-widest">The Threats (Lose)</h3>
              <ul className="text-gray-400 list-disc pl-5 space-y-1">
                <li><strong>Bankruptcy:</strong> Let your available money hit $0.</li>
                <li><strong>Recalled:</strong> Let Public Approval drop below 15% due to high prices or blackouts.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row justify-center gap-4">
          <button 
            onClick={startTutorial}
            className="py-4 px-8 bg-blue-900/30 border border-blue-700 hover:bg-blue-800 text-blue-200 hover:text-white font-bold tracking-widest transition-colors uppercase"
          >
            Quick Tutorial
          </button>
          <button 
            onClick={startGame}
            className="py-4 px-12 bg-green-700 hover:bg-green-600 text-white font-bold tracking-widest transition-colors uppercase text-lg"
          >
            Start Simulation
          </button>
        </div>

        <button 
          onClick={() => setIsManualOpen(true)}
          className="mt-8 text-xs text-gray-500 hover:text-gray-300 uppercase tracking-widest border-b border-gray-700 pb-1"
        >
          Read the Operations Manual
        </button>

      </div>
    </div>
  );
}