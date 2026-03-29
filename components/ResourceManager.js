import React, { useState } from 'react';
import { useGrid } from '../context/GridContext';
import { Factory, Flame, Zap, Wind, Sun, Battery, Activity } from 'lucide-react';
import InfoTip from './InfoTip'; 

export default function ResourceManager() {
  const { 
    fleet, buildPlant, decommissionPlant, usedLand, totalLand, tutorialStep, 
    previewAction, setPreviewAction, isColorblindMode 
  } = useGrid();
  
  const [isDemolishMode, setIsDemolishMode] = useState(false);

  const PALETTE = {
    standard: {
      nuclear: { color: 'text-purple-500', bg: 'border-purple-700', hoverBg: 'hover:bg-purple-900' },
      coal: { color: 'text-gray-400', bg: 'border-gray-600', hoverBg: 'hover:bg-gray-700' },
      ccg: { color: 'text-teal-400', bg: 'border-teal-700', hoverBg: 'hover:bg-teal-900' },
      gas: { color: 'text-orange-500', bg: 'border-orange-700', hoverBg: 'hover:bg-orange-900' }, 
      wind: { color: 'text-blue-400', bg: 'border-blue-700', hoverBg: 'hover:bg-blue-900' },
      solar: { color: 'text-yellow-500', bg: 'border-yellow-700', hoverBg: 'hover:bg-yellow-900' },
      storage: { color: 'text-green-400', bg: 'border-green-500', hoverBg: 'hover:bg-green-900' }
    },
    colorblind: { 
      nuclear: { color: 'text-indigo-400', bg: 'border-indigo-600', hoverBg: 'hover:bg-indigo-800' },
      coal: { color: 'text-zinc-400', bg: 'border-zinc-600', hoverBg: 'hover:bg-zinc-800' },
      ccg: { color: 'text-sky-300', bg: 'border-sky-500', hoverBg: 'hover:bg-sky-700' },
      gas: { color: 'text-rose-500', bg: 'border-rose-700', hoverBg: 'hover:bg-rose-900' },
      wind: { color: 'text-emerald-400', bg: 'border-emerald-600', hoverBg: 'hover:bg-emerald-800' },
      solar: { color: 'text-yellow-300', bg: 'border-yellow-500', hoverBg: 'hover:bg-yellow-700' },
      storage: { color: 'text-amber-500', bg: 'border-amber-700', hoverBg: 'hover:bg-amber-900' }
    }
  };

  const theme = isColorblindMode ? PALETTE.colorblind : PALETTE.standard;

  const ASSETS = {
    nuclear: { name: 'Nuclear', icon: Zap, cap: 100, cost: 785, opex: 10, time: 120, rel: 100, clean: 100, type: 'baseload', ...theme.nuclear },
    coal: { name: 'Coal', icon: Factory, cap: 100, cost: 150, opex: 85, time: 24, rel: 95, clean: 0, type: 'baseload', ...theme.coal },
    ccg: { name: 'CCG Plant', icon: Activity, cap: 100, cost: 120, opex: 40, time: 48, rel: 95, clean: 50, type: 'baseload', ...theme.ccg },
    gas: { name: 'Gas Peaker', icon: Flame, cap: 50, cost: 70, opex: 110, time: 36, rel: 99, clean: 40, type: 'baseload', ...theme.gas },
    wind: { name: 'Wind', icon: Wind, cap: 50, cost: 75, opex: 0, time: 24, rel: 30, clean: 100, type: 'intermittent', ...theme.wind },
    solar: { name: 'Solar', icon: Sun, cap: 50, cost: 75, opex: 0, time: 12, rel: 25, clean: 100, type: 'intermittent', ...theme.solar },
    storage: { name: 'Storage', icon: Battery, cap: 20, cost: 35, opex: 0, time: 12, rel: 100, clean: 100, type: 'intermittent', ...theme.storage }
  };

  const handleMouseEnter = (key, activeCapacity) => {
    setPreviewAction({ type: key, capacity: activeCapacity, action: isDemolishMode ? 'demolish' : 'build' });
  };

  const handleMouseLeave = () => {
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
        
        <div className="flex bg-gray-950 border border-gray-700 rounded-sm">
          <button 
            onClick={() => { setIsDemolishMode(false); setPreviewAction(null); }}
            className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-l-sm transition-all ${
              !isDemolishMode ? 'bg-green-900/50 text-green-400 font-bold' : 'text-gray-500 hover:bg-gray-800'
            } ${tutorialStep === 5 && isDemolishMode ? 'relative z-[70] ring-4 ring-yellow-500 ring-offset-2 ring-offset-gray-900 animate-pulse bg-gray-800 text-white' : ''}`}
          >
            Build
          </button>
          <button 
            onClick={() => { setIsDemolishMode(true); setPreviewAction(null); }}
            className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-r-sm transition-all ${
              isDemolishMode ? 'bg-red-900/50 text-red-400 font-bold' : 'text-gray-500 hover:bg-gray-800'
            } ${tutorialStep === 3 && !isDemolishMode ? 'relative z-[70] ring-4 ring-orange-500 ring-offset-2 ring-offset-gray-900 animate-pulse bg-gray-800 text-white' : ''}`}
          >
            Demolish
          </button>
        </div>
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