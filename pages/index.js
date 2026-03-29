import { useGrid } from '../context/GridContext';
import LoadBalancer from '../components/LoadBalancer';
import StatusTerminal from '../components/StatusTerminal';
import ResourceManager from '../components/ResourceManager';
import PerformanceReview from '../components/PerformanceReview';
import InfoTip from '../components/InfoTip';
import StartScreen from '../components/StartScreen';
import TutorialOverlay from '../components/TutorialOverlay'; 
import OperationsManual from '../components/OperationsManual'; 

export default function Dashboard() {
  const { 
    month, cash, currentIntensity, baselineIntensity, endMonth,
    isPlaying, playSpeed, togglePlay, cycleSpeed, getCarbonTarget,
    compositeApproval, affordabilityIdx, reliabilityIdx, environmentIdx, 
    effectiveDemandMultiplier, gameStatus, tutorialStep, retailRate, creditRating,
    blackoutCount, fleet, isManualOpen, setIsManualOpen, consecutiveLowApproval,
    isColorblindMode, setIsColorblindMode
  } = useGrid();

  const finalTarget = getCarbonTarget(360); 
  const isCarbonMet = Number(currentIntensity.toFixed(2)) <= Number(finalTarget.toFixed(2));

  if (cash < 0) {
    return (
      <div className="bg-gray-950 min-h-screen text-red-500 flex flex-col items-center justify-center font-mono p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">SYSTEM FAILURE: BANKRUPTCY</h1>
        <p className="text-xl">You ran out of money to fuel the grid. The banks have seized your assets.</p>
      </div>
    );
  }
  
  if (compositeApproval < 15 || consecutiveLowApproval >= 6) {
    return (
      <div className="bg-gray-950 min-h-screen text-red-500 flex flex-col items-center justify-center font-mono p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">SYSTEM FAILURE: RECALLED</h1>
        <p className="text-xl">You have been recalled from office due to sustained public outrage over grid mismanagement.</p>
      </div>
    );
  }
  
  if (month > 360) {
    const Scorecard = () => (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left mt-8 border-t border-gray-800 pt-8">
        <div className="bg-gray-900 border border-gray-700 p-4">
          <div className="text-gray-500 text-[10px] tracking-widest uppercase mb-1">Final Treasury</div>
          <div className={`text-2xl font-bold ${cash > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${(cash / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-400 mt-1 uppercase">Rating: <span className="text-white">{creditRating}</span></div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-4">
          <div className="text-gray-500 text-[10px] tracking-widest uppercase mb-1">Final Retail Rate</div>
          <div className="text-2xl font-bold text-blue-400">
            ${retailRate.toFixed(2)}<span className="text-sm text-gray-500">/kWh</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 uppercase">Affordability: <span className="text-white">{affordabilityIdx.toFixed(0)}%</span></div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-4">
          <div className="text-gray-500 text-[10px] tracking-widest uppercase mb-1">Lifetime Blackouts</div>
          <div className="text-2xl font-bold text-orange-400">
            {blackoutCount} <span className="text-sm text-gray-500">Events</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 uppercase">Reliability: <span className="text-white">{reliabilityIdx.toFixed(0)}%</span></div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-4">
          <div className="text-gray-500 text-[10px] tracking-widest uppercase mb-1">Clean Capacity Built</div>
          <div className="text-2xl font-bold text-teal-400">
            {fleet.solar + fleet.wind + fleet.storage + fleet.nuclear} <span className="text-sm text-gray-500">MW</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 uppercase">Final Carbon: <span className="text-white">{currentIntensity.toFixed(2)} T/MWh</span></div>
        </div>
      </div>
    );

    if (isCarbonMet && blackoutCount <= 12) {
      return (
        <div className="bg-gray-950 min-h-screen text-green-500 flex flex-col items-center justify-center font-mono p-10 text-center">
          <h1 className="text-5xl font-bold tracking-tighter mb-2">SIMULATION COMPLETE: VICTORY</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            You successfully navigated the economics and politics of the energy transition. The grid is clean, solvent, and highly reliable.
          </p>
          <Scorecard />
        </div>
      );
    }
    
    return (
      <div className="bg-gray-950 min-h-screen text-yellow-500 flex flex-col items-center justify-center font-mono p-10 text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">SIMULATION COMPLETE: DEFEAT</h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          You survived 30 years, but you failed to hit your Carbon Emissions goal and keep Blackouts under 12. 
        </p>
        <Scorecard />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden font-mono p-6 relative">

      {gameStatus === 'start_screen' && <StartScreen />}
      {gameStatus === 'tutorial' && <TutorialOverlay />}
      {gameStatus === 'ended' && <PerformanceReview />}
      <OperationsManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      {gameStatus !== 'start_screen' && (
        <div className="flex justify-between items-center bg-gray-900 border border-blue-900/50 p-2 px-4 rounded mb-4 text-xs font-bold text-blue-200 shadow-lg flex-shrink-0">
          <span className="text-blue-400 uppercase tracking-widest mr-4">Mission Objectives:</span>
          <div className="flex flex-wrap gap-4 md:gap-6">
             <span className="flex items-center gap-2 whitespace-nowrap">
               ⏱ Survive to M: 360
             </span>
             <span className={`flex items-center gap-2 whitespace-nowrap ${currentIntensity <= finalTarget ? 'text-green-400' : ''}`}>
               🌍 Reach 0.00 Carbon Target
             </span>
             <span className={`flex items-center gap-2 whitespace-nowrap ${blackoutCount > 12 ? 'text-red-500' : ''}`}>
               ⚡ Blackouts: {blackoutCount} / 12 MAX
             </span>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end pb-6 border-b border-gray-800 mb-6 flex-shrink-0 gap-4">
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tighter text-green-400 m-0 leading-none">
              GRID MASTER // TERMINAL
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsManualOpen(true)}
                className="text-[10px] bg-blue-900/30 text-blue-400 border border-blue-800 hover:bg-blue-800 hover:text-white px-2 py-1 rounded-sm tracking-widest transition-colors uppercase cursor-pointer"
              >
                [?] Operations Manual
              </button>
              <button 
                onClick={() => setIsColorblindMode(!isColorblindMode)}
                className={`text-[10px] px-2 py-1 rounded-sm tracking-widest transition-colors uppercase cursor-pointer border ${
                  isColorblindMode 
                    ? 'bg-amber-900/30 text-amber-400 border-amber-800 hover:bg-amber-800 hover:text-white' 
                    : 'bg-gray-800/30 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
              >
                [👁] CB Mode: {isColorblindMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
             <span className={currentIntensity <= baselineIntensity ? "text-green-500" : "text-orange-500"}>
               <InfoTip termKey="carbonIntensity" label="CARBON EMISSIONS:" /> {currentIntensity.toFixed(2)} Tons/MWh
             </span>
             <span className="text-orange-500">
               <InfoTip termKey="regulatoryFines" label="CURRENT GOAL:" /> &lt; {getCarbonTarget(month).toFixed(2)} TONS/MWh
             </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-xs items-center bg-gray-900 p-3 rounded-sm border border-gray-800 shadow-md">
            <span className="whitespace-nowrap">MONTH: {month}/360 (YR {Math.ceil(month/12)})</span>
            <span className={`whitespace-nowrap ${cash < 0 ? "text-red-500 font-bold" : ""}`}>FUNDS: ${(cash / 1000000).toFixed(1)}M</span>
            
            <span className="text-blue-400 flex items-center whitespace-nowrap">
              <InfoTip termKey="peakDemand" label="DEMAND:" /> &nbsp;{(effectiveDemandMultiplier * 100).toFixed(0)}%
            </span>
            
            {/* FIX: The new interactive Hover Tooltip for Approval */}
            <div className="relative flex gap-3 border-l border-gray-700 pl-4 ml-2 items-center whitespace-nowrap group cursor-help">
              <span className={compositeApproval < 30 ? "text-red-500 font-bold border-b border-dashed border-red-500" : "text-green-400 font-bold border-b border-dashed border-green-400"}>
                APPROVAL: {compositeApproval?.toFixed(1) || 100}%
              </span>
              
              <div className="absolute top-full right-0 mt-3 bg-gray-950 border border-gray-700 p-3 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] min-w-max">
                <div className="flex flex-col gap-2 text-[10px] tracking-widest uppercase">
                  <div className="text-gray-500 border-b border-gray-800 pb-1 mb-1">Tripartite Index</div>
                  <div className="flex justify-between gap-8 text-gray-400">
                    <span>Affordability:</span> 
                    <span className={affordabilityIdx < 30 ? 'text-red-400 font-bold' : 'text-white'}>{affordabilityIdx?.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between gap-8 text-gray-400">
                    <span>Reliability:</span> 
                    <span className={reliabilityIdx < 30 ? 'text-red-400 font-bold' : 'text-white'}>{reliabilityIdx?.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between gap-8 text-gray-400">
                    <span>Environment:</span> 
                    <span className={environmentIdx < 30 ? 'text-red-400 font-bold' : 'text-white'}>{environmentIdx?.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </header>

      <div className="flex-1 min-h-0 flex gap-6">
        <div className="w-80 max-w-[20rem] flex-none flex flex-col min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar">
          <StatusTerminal />
        </div>

        <div className="flex-1 min-w-0 flex flex-col bg-gray-900 border border-gray-800 relative">
          <LoadBalancer />
        </div>

        <div className="w-80 flex-none flex flex-col min-h-0 gap-4">
          <ResourceManager />

          <div className="flex-shrink-0 grid grid-cols-3 gap-2">
            <button 
              onClick={togglePlay}
              className={`text-xs font-bold py-3 uppercase tracking-wider transition-all ${
                tutorialStep === 7 
                  ? 'relative z-[70] ring-4 ring-white ring-offset-2 ring-offset-gray-900 animate-pulse scale-105 bg-green-600 text-white' 
                  : isPlaying ? 'bg-red-900 text-red-100 hover:bg-red-800' : 'bg-green-700 text-green-100 hover:bg-green-600'
              }`}
            >
              {isPlaying ? 'PAUSE' : 'AUTO-PLAY'}
            </button>
            
            <button 
              onClick={cycleSpeed}
              className="text-xs font-mono bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300 transition-colors uppercase"
            >
              {playSpeed === 1000 ? '1x' : playSpeed === 250 ? '4x' : 'MAX'}
            </button>
            
            <button 
              onClick={() => !isPlaying && endMonth()}
              disabled={isPlaying}
              className={`text-xs uppercase transition-all ${
                tutorialStep === 7 
                  ? 'relative z-[70] ring-4 ring-white ring-offset-2 ring-offset-gray-900 animate-pulse scale-105 bg-gray-700 text-white' 
                  : 'bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              STEP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}