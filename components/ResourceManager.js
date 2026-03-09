import { useGrid } from '../context/GridContext';
import { Factory, Flame, Zap, Wind, Sun, Battery } from 'lucide-react';
import InfoTip from './InfoTip'; 

export default function ResourceManager() {
  // NEW: Pulled tutorialStep from the context
  const { fleet, buildPlant, decommissionPlant, retailRate, setRetailRate, creditRating, issueBond, usedLand, totalLand, tutorialStep } = useGrid();
  
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 flex flex-col flex-1 min-h-0">
      
      <h2 className="text-green-500 mb-4 uppercase tracking-widest border-b border-green-800 pb-2 flex-shrink-0">
        Asset Fleet (CapEx)
      </h2>

      {/* Ratepayer Policy Lever */}
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

      {/* Municipal Bond Market */}
      <div className="bg-gray-900 p-3 mb-4 border border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-widest"><InfoTip termKey="bond" label="Bond Market" /></span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${creditRating === 'AAA' ? 'bg-green-900 text-green-300' : creditRating === 'JUNK' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
            <InfoTip termKey="creditRating" label="RATING:" /> {creditRating}
          </span>
        </div>
        <button 
          onClick={() => issueBond(100000000, 10)} 
          // SPOTLIGHT: Pulled to z-[70] with a purple ring if tutorialStep is 4
          className={`w-full text-xs py-2 transition-all ${
            tutorialStep === 4 
              ? 'bg-gray-700 relative z-[70] ring-4 ring-purple-500 ring-offset-2 ring-offset-gray-900 animate-pulse scale-105' 
              : 'bg-gray-800 border border-gray-600 hover:bg-gray-700'
          }`}
        >
          Issue $100M Bond (10 Yr)
        </button>
      </div>

      {/* Municipal Land Budget */}
      <div className="bg-gray-900 p-3 mb-4 border border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400 uppercase tracking-widest"><InfoTip termKey="interconnection" label="Municipal Zone Limit" /></span>
          <span className={`text-xs font-bold ${usedLand > totalLand ? 'text-red-500' : 'text-green-500'}`}>
            {usedLand.toLocaleString()} / {totalLand.toLocaleString()} Acres
          </span>
        </div>
        <div className="w-full bg-gray-800 h-2 mt-2">
          <div 
            className={`h-2 ${usedLand > totalLand ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${Math.min(100, (usedLand / totalLand) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto pr-2 my-2 space-y-2 custom-scrollbar">
        
        <div className="flex justify-between items-center bg-gray-900 p-2 border-l-2 border-gray-600">
          <span className="flex items-center gap-2"><Factory size={16} className="text-gray-400"/> <InfoTip termKey="coal" label="Coal" /> ({fleet.coal} MW)</span>
          <div className="flex gap-1">
            <button 
              onClick={() => decommissionPlant('coal', 12500000, 50)} 
              title="Toxic Ash Remediation: $12.5M | Time: Instant" 
              // SPOTLIGHT: Pulled to z-[70] with an orange ring if tutorialStep is 3
              className={`text-xs px-2 py-1 transition-all ${
                tutorialStep === 3 
                  ? 'bg-red-600 relative z-[70] ring-4 ring-orange-500 ring-offset-2 ring-offset-gray-900 animate-pulse scale-110' 
                  : 'bg-red-900 hover:bg-red-700'
              }`}
            >
              -
            </button>
            <button onClick={() => buildPlant('coal', 150000000, 100)} title="OpEx: $85/MWh | Time: Instant" className="text-xs bg-gray-800 px-2 py-1 hover:bg-gray-700">+$150M</button>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-gray-900 p-2 border-l-2 border-orange-700">
          <span className="flex items-center gap-2"><Flame size={16} className="text-orange-500"/> <InfoTip termKey="gas" label="Gas" /> ({fleet.gas} MW)</span>
          <div className="flex gap-1">
            <button onClick={() => decommissionPlant('gas', 1000000, 50)} title="Salvage Value Offset: $1M | Time: Instant" className="text-xs bg-red-900 px-2 py-1 hover:bg-red-700">-</button>
            <button onClick={() => buildPlant('gas', 70000000, 50)} title="OpEx: $110/MWh | Time: 36 mo" className="text-xs bg-gray-800 px-2 py-1 hover:bg-orange-900">+$70M</button>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-gray-900 p-2 border-l-2 border-purple-700">
          <span className="flex items-center gap-2"><Zap size={16} className="text-purple-500"/> <InfoTip termKey="nuclear" label="Nuclear" /> ({fleet.nuclear} MW)</span>
          <button onClick={() => buildPlant('nuclear', 785000000, 100)} title="OpEx: $10/MWh | Time: 120 mo" className="text-xs bg-gray-800 px-2 py-1 hover:bg-purple-900">+$785M</button>
        </div>

        <div className="flex justify-between items-center bg-gray-900 p-2 border-l-2 border-blue-700 mt-4">
          <span className="flex items-center gap-2"><Wind size={16} className="text-blue-400"/> <InfoTip termKey="wind" label="Wind" /> ({fleet.wind} MW)</span>
          <button onClick={() => buildPlant('wind', 75000000, 50)} title="OpEx: $0/MWh | Time: 24 mo" className="text-xs bg-gray-800 px-2 py-1 hover:bg-blue-900">+$75M</button>
        </div>
        
        <div className="flex justify-between items-center bg-gray-900 p-2 border-l-2 border-yellow-700">
          <span className="flex items-center gap-2"><Sun size={16} className="text-yellow-500"/> <InfoTip termKey="solar" label="Solar" /> ({fleet.solar} MW)</span>
          <button 
            onClick={() => buildPlant('solar', 75000000, 50)} 
            title="OpEx: $0/MWh | Time: 12 mo" 
            // SPOTLIGHT: Pulled to z-[70] if tutorialStep is 5
            className={`text-xs px-2 py-1 transition-all ${
              tutorialStep === 5 
                ? 'bg-yellow-700 relative z-[70] ring-4 ring-yellow-500 ring-offset-2 ring-offset-gray-900 animate-pulse scale-110' 
                : 'bg-gray-800 hover:bg-yellow-900'
            }`}
          >
            +$75M
          </button>
        </div>

        <div className="flex justify-between items-center bg-gray-900 p-2 border-l-2 border-green-500 mt-4">
          <span className="flex items-center gap-2"><Battery size={16} className="text-green-400"/> <InfoTip termKey="battery" label="Storage" /> ({fleet.storage} MW)</span>
          <button 
            onClick={() => buildPlant('storage', 35000000, 20)} 
            title="OpEx: $0/MWh | Time: 12 mo" 
            // SPOTLIGHT: Pulled to z-[70] if tutorialStep is 5
            className={`text-xs px-2 py-1 transition-all ${
              tutorialStep === 5 
                ? 'bg-green-700 relative z-[70] ring-4 ring-green-500 ring-offset-2 ring-offset-gray-900 animate-pulse scale-110' 
                : 'bg-gray-800 hover:bg-green-900'
            }`}
          >
            +$35M
          </button>
        </div>

      </div>
    </div>
  );
}