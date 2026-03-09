import React, { useEffect } from 'react';
import { useGrid } from '../context/GridContext';

export default function TutorialOverlay() {
  const { fleet, bonds, constructionQueue, startGame, tutorialStep, setTutorialStep, isPlaying, month } = useGrid();

  // Reactive Observers: Auto-advance based on player actions!
  useEffect(() => {
    if (tutorialStep === 3 && fleet.coal < 400) setTutorialStep(4);
    if (tutorialStep === 4 && bonds.length > 0) setTutorialStep(5);
    if (tutorialStep === 5 && constructionQueue.some(p => p.type === 'solar') && constructionQueue.some(p => p.type === 'storage')) setTutorialStep(6);
    if (tutorialStep === 7 && (isPlaying || month > 1)) startGame(); // Finish tutorial if they press play or step!
  }, [tutorialStep, fleet.coal, bonds.length, constructionQueue, isPlaying, month, setTutorialStep, startGame]);

  return (
    <div className="absolute inset-0 z-[60] pointer-events-none">
      <div className="absolute inset-0 bg-gray-950/40" />

      {tutorialStep === 1 && (
        <div className="absolute top-28 left-8 bg-gray-900 border-2 border-green-500 p-6 max-w-md shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-green-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 1: The Mandate</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Welcome to the control room, Director. Up top is your <strong>Carbon Intensity</strong>. By Year 30, this city must reach Net Zero. Right now, we are burning coal and heavily exceeding the mandate. Let's fix that.
          </p>
          <button onClick={() => setTutorialStep(2)} className="w-full py-2 bg-green-700 hover:bg-green-600 text-white font-bold text-xs tracking-widest uppercase">Acknowledge</button>
        </div>
      )}

      {tutorialStep === 2 && (
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 bg-gray-900 border-2 border-blue-400 p-6 max-w-sm shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-blue-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 2: The Heartbeat</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            This center chart is the <strong>Dispatch Stack</strong>. It models 24 hours of grid physics. If the colored power blocks ever fall below the red demand line, the grid fails, rolling blackouts hit the city, and you get fired.
          </p>
          <button onClick={() => setTutorialStep(3)} className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs tracking-widest uppercase">Acknowledge</button>
        </div>
      )}

      {tutorialStep === 3 && (
        <div className="absolute top-48 right-[24rem] bg-gray-900 border-2 border-orange-500 p-6 max-w-xs shadow-2xl rounded-sm">
          <h3 className="text-orange-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 3: The Physics</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Let's start the clean transition. Click the red minus button to <strong>Decommission a Coal plant</strong>. Watch what happens to your supply chart when you do.
          </p>
          <div className="text-xs text-orange-500 animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

      {tutorialStep === 4 && (
        <div className="absolute top-32 right-[24rem] bg-gray-900 border-2 border-purple-500 p-6 max-w-xs shadow-2xl rounded-sm">
          <h3 className="text-purple-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 4: The Economy</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            You just lost 50MW of supply! We need to build clean power, but you lack capital. <strong>Issue a Municipal Bond</strong> to raise $100M immediately.
          </p>
          <div className="text-xs text-purple-500 animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

      {tutorialStep === 5 && (
        <div className="absolute top-1/2 right-[24rem] bg-gray-900 border-2 border-yellow-500 p-6 max-w-sm shadow-2xl rounded-sm">
          <h3 className="text-yellow-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 5: The Transition</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            With cash secured, let's build the future. <strong>Build Solar</strong> to cover daytime demand, AND <strong>Build Storage</strong> to save that power for the evening peak.
          </p>
          <div className="text-xs text-yellow-500 animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

      {tutorialStep === 6 && (
        <div className="absolute top-48 left-[22rem] bg-gray-900 border-2 border-teal-500 p-6 max-w-sm shadow-2xl pointer-events-auto rounded-sm">
          <h3 className="text-teal-400 font-bold tracking-widest mb-2 uppercase text-sm">Step 6: The Ledger</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            This left panel is your status terminal. It contains monthly events, your financials, and the construction pipeline. In the finance tab you will see monthly cash flow. While green energy is cheap to run, watch out as you complete the transition. Bond interest, overhead, and emergency gas fuel will drain your cash fast.
          </p>
          <button onClick={() => setTutorialStep(7)} className="w-full py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs tracking-widest uppercase">Acknowledge</button>
        </div>
      )}

      {tutorialStep === 7 && (
        <div className="absolute bottom-24 right-[24rem] bg-gray-900 border-2 border-white p-6 max-w-sm shadow-2xl rounded-sm">
          <h3 className="text-white font-bold tracking-widest mb-2 uppercase text-sm">Step 7: Time Control</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            You are in control. Press <strong>STEP</strong> to move forward exactly one month and see how your grid handles the weather, or press <strong>AUTO-PLAY</strong> to start the 30-year simulation. Good luck.
          </p>
          <div className="text-xs text-white animate-pulse tracking-widest text-center mt-2">AWAITING ACTION...</div>
        </div>
      )}

    </div>
  );
}