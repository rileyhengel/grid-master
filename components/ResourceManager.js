import React, { useState, useRef } from 'react';
import { useGrid } from '../context/GridContext';
import { Factory, Flame, Zap, Wind, Sun, Battery, Activity } from 'lucide-react';
import InfoTip from './InfoTip'; 

export default function ResourceManager() {
  const { 
    fleet, buildPlant, decommissionPlant, retailRate, setRetailRate, 
    creditRating, issueBond, usedLand, totalLand, tutorialStep, previewAction, setPreviewAction 
  } = useGrid();
  
  const [isDemolishMode, setIsDemolishMode] = useState(false);
  const hoverTimeout = useRef(null);

  const ASSETS = {
    nuclear: { name: 'Nuclear', icon: Zap, color: 'text-purple-500', bg: 'border-purple-700', hoverBg: 'hover:bg-purple-900', cap: 100, cost: 785, opex: 10, time: 120, rel: 100, clean: 100, type: 'baseload' },
    coal: { name: 'Coal', icon: Factory, color: 'text-gray-400', bg: 'border-gray-600', hoverBg: 'hover:bg-gray-700', cap: 100, cost: 150, opex: 85, time: 24, rel: 95, clean: 0, type: 'baseload' },
    ccg: { name: 'CCG Plant', icon: Activity, color: 'text-teal-400', bg: 'border-teal-700', hoverBg: 'hover:bg-teal-900', cap: 100, cost: 120, opex: 40, time: 48, rel: 95, clean: 50, type: 'baseload' },
    gas: { name: 'Gas Peaker', icon: Flame, color: 'text-slate-400', bg: 'border-slate-500', hoverBg: 'hover:bg-slate-800', cap: 50, cost: 70, opex: 110, time: 36, rel: 99, clean: 40, type: 'baseload' },
    wind: { name: 'Wind', icon: Wind, color: 'text-blue-400', bg: 'border-blue-700', hoverBg: 'hover:bg-blue-900', cap: 50, cost: 75, opex: 0, time: 24, rel: 30, clean: 100, type: 'intermittent' },
    solar: { name: 'Solar', icon: Sun, color: 'text-yellow-500', bg: 'border-yellow-700', hoverBg: 'hover:bg-yellow-900', cap: 50, cost: 75, opex: 0, time: 12, rel: 25, clean: 100, type: 'intermittent' },
    storage: { name: 'Storage', icon: Battery, color: 'text-green-400', bg: 'border-green-500', hoverBg: 'hover:bg-green-900', cap: 20, cost: 35, opex: 0, time: 12, rel: 100, clean: 100, type: 'intermittent' }
  };

  const handleMouseEnter = (key, activeCapacity) => {
    hoverTimeout.current = setTimeout(() => {
      setPreviewAction({ type: key, capacity: activeCapacity, action: isDemolishMode ? 'demolish' : 'build' });
    }, 300); 
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setPreviewAction(null);
  };

  const renderAssetCard = (key) => {
    const asset = ASSETS[key];
    const Icon = asset.icon;
    const currentFleet = fleet[key] || 0;
    
    const scrapCap = Math.min(50, asset.cap);
    const isHoveringThis = previewAction?.type === key;

    const isStep3Target = tutorialStep === 3 && key === 'coal';
    const isStep5Target = tutorialStep === 5 && (key === 'solar' || key === 'storage');
    const isTargetCard = isStep3Target || isStep5Target;
    
    return (
      <div 
        key={key} 
        className={`bg-gray-900 p-2 border-l-2 ${asset.bg} mb-2 transition-all ${isDemolishMode ? 'opacity-80' : ''} ${isTargetCard ? 'relative z-[70]' : ''}`}
      >
        <div className="flex justify-between items-center mb-1 gap-2">
          
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon size={14} className={`flex-shrink-0 ${asset.color}`}/> 
            <span className="font-bold text-sm truncate">
              <InfoTip termKey={key} label={asset.name} /> 
            </span>
            
            <span className="text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
              ({currentFleet}
              {isHoveringThis && !isDemolishMode && <span className="text-green-400 ml-1 font-bold animate-pulse">+{asset.cap}</span>}
              {isHoveringThis && isDemolishMode && <span className="text-red-400 ml-1 font-bold animate-pulse">-{scrapCap}</span>}
              <span className="ml-1">MW</span>)
            </span>
          </div>

          {isDemolishMode ? (
            <button 
              onClick={() => decommissionPlant(key, 5000000, scrapCap)} 
              onMouseEnter={() => handleMouseEnter(key, scrapCap)}
              onMouseLeave={handleMouseLeave}
              disabled={currentFleet < scrapCap}
              className={`flex-shrink-0 text-[10px] text-white px-3 py-1 uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
                isStep3Target 
                  ? 'bg-red-600 ring-4 ring-orange-500 ring-offset-1 ring-offset-gray-900 animate-pulse scale-110' 
                  : 'bg-red-900 hover:bg-red-700'
              }`}
            >
              Scrap
            </button>
          ) : (
            <button 
              onClick={() => buildPlant(key, asset.cost * 1000000, asset.cap)} 
              onMouseEnter={() => handleMouseEnter(key, asset.cap)}
              onMouseLeave={handleMouseLeave}
              className={`flex-shrink-0 text-[10px] text-white px-3 py-1 uppercase tracking-widest transition-all ${
                isStep5Target
                  ? 'bg-yellow-700 ring-4 ring-yellow-500 ring-offset-1 ring-offset-gray-900 animate-pulse scale-110'
                  : `bg-gray-800 ${asset.hoverBg}`
              }`}
            >
              +${asset.cost}M
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase">Reliability</span>
            <div className="h-1 w-full bg-gray-800 mt-0.5"><div className={`h-1 bg-blue-500`} style={{width: `${asset.rel}%`}}></div></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase">Cleanliness</span>
            <div className="h-1 w-full bg-gray-800 mt-0.5"><div className={`h-1 bg-green-500`} style={{width: `${asset.clean}%`}}></div></div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-gray-500 uppercase">OpEx</span>
            <span className="text-[10px] text-gray-300 leading-none mt-0.5">${asset.opex}/MWh</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-700 p-4 flex flex-col flex-1 min-h-0">
      
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2 flex-shrink-0">
        <h2 className="text-green-500 uppercase tracking-widest">Asset Fleet</h2>
        
        {/* FIX: Removed overflow-hidden so the spotlights can escape the container */}
        <div className="flex bg-gray-950 border border-gray-700 rounded-sm">
          <button 
            onClick={() => { setIsDemolishMode(false); setPreviewAction(null); }}
            // FIX: Added rounded-l-sm and fixed the heavy ring-4 styling
            className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-l-sm transition-all ${
              !isDemolishMode ? 'bg-green-900/50 text-green-400 font-bold' : 'text-gray-500 hover:bg-gray-800'
            } ${tutorialStep === 5 && isDemolishMode ? 'relative z-[70] ring-4 ring-yellow-500 ring-offset-2 ring-offset-gray-900 animate-pulse bg-gray-800 text-white' : ''}`}
          >
            Build
          </button>
          <button 
            onClick={() => { setIsDemolishMode(true); setPreviewAction(null); }}
            // FIX: Added rounded-r-sm and fixed the heavy ring-4 styling
            className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-r-sm transition-all ${
              isDemolishMode ? 'bg-red-900/50 text-red-400 font-bold' : 'text-gray-500 hover:bg-gray-800'
            } ${tutorialStep === 3 && !isDemolishMode ? 'relative z-[70] ring-4 ring-orange-500 ring-offset-2 ring-offset-gray-900 animate-pulse bg-gray-800 text-white' : ''}`}
          >
            Demolish
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-3 mb-4 border border-gray-700 flex-shrink-0">
        <label className="text-xs text-gray-400 flex justify-between mb-1">
          <span><InfoTip termKey="retailRate" label="Retail Rate ($/kWh)" /></span>
          <span className={retailRate > 0.12 ? "text-red-400" : "text-green-400"}>${retailRate.toFixed(2)}</span>
        </label>
        <input 
          type="range" min="0.10" max="0.25" step="0.01" 
          value={retailRate} 
          onChange={(e) => setRetailRate(parseFloat(e.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      <div className="bg-gray-900 p-3 mb-4 border border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-widest"><InfoTip termKey="bond" label="Bond Market" /></span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${creditRating === 'AAA' ? 'bg-green-900 text-green-300' : creditRating === 'JUNK' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
            <InfoTip termKey="creditRating" label="RATING:" /> {creditRating}
          </span>
        </div>
        <button 
          onClick={() => issueBond(100000000, 10)} 
          className={`w-full text-xs py-2 uppercase tracking-widest transition-all ${
            tutorialStep === 4 
              ? 'relative z-[70] bg-purple-800 text-white ring-4 ring-purple-500 ring-offset-2 ring-offset-gray-900 animate-pulse scale-105' 
              : 'bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          Issue $100M Bond (10 Yr)
        </button>
      </div>

      <div className="bg-gray-900 p-3 mb-4 border border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400 uppercase tracking-widest"><InfoTip termKey="interconnection" label="City Land Limit" /></span>
          <span className={`text-xs font-bold ${usedLand > totalLand ? 'text-red-500' : 'text-orange-400'}`}>
            {usedLand.toLocaleString()} / {totalLand.toLocaleString()} Acres
          </span>
        </div>
        <div className="w-full bg-gray-800 h-2 mt-2">
          <div 
            className={`h-2 ${usedLand > totalLand ? 'bg-red-500' : 'bg-orange-500'}`} 
            style={{ width: `${Math.min(100, (usedLand / totalLand) * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 my-2 space-y-4 custom-scrollbar">
        <div>
          <h3 className="text-[10px] text-gray-500 tracking-widest uppercase mb-2 border-b border-gray-800 pb-1">Baseload & Dispatchable</h3>
          {renderAssetCard('nuclear')}
          {renderAssetCard('coal')}
          {renderAssetCard('ccg')}
          {renderAssetCard('gas')}
        </div>
        <div>
          <h3 className="text-[10px] text-gray-500 tracking-widest uppercase mb-2 border-b border-gray-800 pb-1">Intermittent & Storage</h3>
          {renderAssetCard('wind')}
          {renderAssetCard('solar')}
          {renderAssetCard('storage')}
        </div>
      </div>
    </div>
  );
}