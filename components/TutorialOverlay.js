import React, { useEffect } from 'react';
import { useGrid } from '../context/GridContext';

export default function TutorialOverlay() {
  const { fleet, bonds, constructionQueue, startGame, tutorialStep, setTutorialStep, isPlaying, month, setIsManualOpen } = useGrid();

  useEffect(() => {
    // FIX: Changed from < 400 to < 500 to account for the new starting capacity!
    if (tutorialStep === 3 && fleet.coal < 500) setTutorialStep(4);
    if (tutorialStep === 4 && bonds.length > 0) setTutorialStep(5);
    if (tutorialStep === 5 && constructionQueue.some(p => p.type === 'solar') && constructionQueue.some(p => p.type === 'storage')) setTutorialStep(6);
    if (tutorialStep === 7 && (isPlaying || month > 1)) startGame(); 
  }, [tutorialStep, fleet.coal, bonds.length, constructionQueue, isPlaying, month, setTutorialStep, startGame]);

  return (
    <div className="absolute inset-0 z-[60] pointer-events-none">
      <div className="absolute inset-0 bg-gray-950/40" />

      {tutorialStep === 1 && (
        <div className="absolute top-28 left-8 bg-gray-900 border-2 border-green-500 p-6 max-w-md shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-green-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 1: The Mission</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Welcome, Director. Look at the <strong>Mission Objectives</strong> at the top of your screen. To win, you must survive 30 years, reach 0.00 Carbon Emissions, and keep blackouts under 12. Right now, we are burning dirty coal. Let's fix that.
          </p>
          <button onClick={() => setTutorialStep(2)} className="w-full py-2 bg-green-700 hover:bg-green-600 text-white font-bold text-xs tracking-widest uppercase">Understood</button>
        </div>
      )}

      {tutorialStep === 2 && (
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 bg-gray-900 border-2 border-blue-400 p-6 max-w-sm shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-blue-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 2: The Power Grid</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            This center chart shows 24 hours of electricity. The colored blocks are the power you generate. The red line is what the city needs. If your power falls below the red line, the city goes dark and the Mayor will fire you.
          </p>
          <button onClick={() => setTutorialStep(3)} className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs tracking-widest uppercase">Understood</button>
        </div>
      )}

      {tutorialStep === 3 && (
        <div className="absolute top-48 right-[24rem] bg-gray-900 border-2 border-orange-500 p-6 max-w-xs shadow-2xl rounded-sm">
          <h3 className="text-orange-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 3: Forecasting</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Let's start the transition. First, flip the toggle switch to <strong>Demolish</strong>. Then, <strong>hover</strong> over the Scrap Coal button. Watch the chart to preview how your other plants will stretch to fill the gap! Finally, click it.
          </p>
          <div className="text-xs text-orange-500 animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

      {tutorialStep === 4 && (
        <div className="absolute top-32 right-[24rem] bg-gray-900 border-2 border-purple-500 p-6 max-w-xs shadow-2xl rounded-sm">
          <h3 className="text-purple-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 4: Raising Capital</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            You just lost a chunk of your power supply! We need to build clean energy to replace it, but you lack the cash. <strong>Issue a Municipal Bond</strong> to borrow $100M immediately.
          </p>
          <div className="text-xs text-purple-500 animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

      {tutorialStep === 5 && (
        <div className="absolute top-1/2 right-[24rem] bg-gray-900 border-2 border-yellow-500 p-6 max-w-sm shadow-2xl rounded-sm">
          <h3 className="text-yellow-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 5: The Rebuild</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Flip your toggle back to <strong>Build</strong>. Hover over Solar and Storage to see their translucent "Ghost Blocks" on the chart. Then, build <strong>Solar</strong> for daytime power and <strong>Storage</strong> to save it for the night.
          </p>
          <div className="text-xs text-yellow-500 animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

      {tutorialStep === 6 && (
        <div className="absolute top-48 left-[22rem] bg-gray-900 border-2 border-teal-500 p-6 max-w-sm shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-teal-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 6: The Finances</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            This left panel tracks your money and events. Green energy is cheap to run, but bond loans and emergency blackout penalties will drain your cash fast. If your Funds hit $0, you go bankrupt and lose.
          </p>
          <button onClick={() => setTutorialStep(7)} className="w-full py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs tracking-widest uppercase">Understood</button>
        </div>
      )}

      {tutorialStep === 7 && (
        <div className="absolute bottom-24 right-[24rem] bg-gray-900 border-2 border-white p-6 max-w-sm shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-white font-bold tracking-widest mb-2 uppercase text-sm">Step 7: Take Control</h3>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            You are in control. Press <strong>STEP</strong> to move forward one month, or <strong>AUTO-PLAY</strong> for the full 30 years. Need to understand the rules better? Read the Operations Manual.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                startGame();
                setIsManualOpen(true);
              }} 
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs tracking-widest uppercase border border-gray-600 transition-colors"
            >
              Read Operations Manual
            </button>
            <div className="text-xs text-white animate-pulse tracking-widest text-center mt-2">AWAITING STEP OR PLAY...</div>
          </div>
        </div>
      )}

    </div>
  );
}