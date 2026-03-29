import React, { useState, useEffect } from 'react';
import { useGrid } from '../context/GridContext';
import InfoTip from './InfoTip';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StatusTerminal() {
  const { 
    eventLog, financialReport, cashFlow, constructionQueue,
    retailRate, setRetailRate, creditRating, issueBond, tutorialStep
  } = useGrid();

  const [activeTab, setActiveTab] = useState('events');
  const [isLedgerExpanded, setIsLedgerExpanded] = useState(false);

  useEffect(() => {
    if (tutorialStep === 4 || tutorialStep === 6) {
      setActiveTab('finances');
    }
  }, [tutorialStep]);

  const totalExpenses = (financialReport.opex || 0) + (financialReport.tandd || 0) + (financialReport.pilot || 0);
  const totalPenalties = (financialReport.voll || 0) + (financialReport.curtailment || 0) + (financialReport.fines || 0);

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800">
      <div className="flex border-b border-gray-800 shrink-0">
         <button 
            onClick={() => setActiveTab('events')} 
            className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'events' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-800/50' : 'text-gray-500 hover:bg-gray-800'}`}
         >
            Events
         </button>
         <button 
            onClick={() => setActiveTab('finances')} 
            className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'finances' ? 'border-b-2 border-green-500 text-green-400 bg-gray-800/50' : 'text-gray-500 hover:bg-gray-800'}`}
         >
            Finances
         </button>
         <button 
            onClick={() => setActiveTab('pipeline')} 
            className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'pipeline' ? 'border-b-2 border-yellow-500 text-yellow-400 bg-gray-800/50' : 'text-gray-500 hover:bg-gray-800'}`}
         >
            Pipeline
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
        
        {activeTab === 'events' && (
          <div className="space-y-3">
            {eventLog.map((log, i) => (
              <div key={i} className="text-xs text-gray-300 leading-relaxed font-mono">
                <span className="text-blue-400 font-bold">[{log.m}/360]</span> {log.text}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'finances' && (
           <div className="flex flex-col gap-6">
             <div className="bg-gray-950 p-3 border border-gray-800 rounded-sm">
                <label className="text-xs text-gray-400 flex justify-between mb-2 font-bold tracking-widest uppercase">
                  <span><InfoTip termKey="retailRate" label="Retail Rate" /></span>
                  <span className={retailRate > 0.16 ? "text-red-400" : "text-green-400"}>${retailRate.toFixed(2)}/kWh</span>
                </label>
                <input 
                  type="range" min="0.10" max="0.25" step="0.01" 
                  value={retailRate} 
                  onChange={(e) => setRetailRate(parseFloat(e.target.value))}
                  className="w-full accent-green-500"
                />
             </div>

             <div className="bg-gray-950 p-3 border border-gray-800 rounded-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-widest"><InfoTip termKey="bond" label="Bond Market" /></span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${creditRating === 'AAA' ? 'bg-green-900 text-green-300' : creditRating === 'JUNK' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    RATING: {creditRating}
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

             <div className="flex flex-col gap-2 border-t border-gray-800 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-widest">Monthly Ledger</h3>
                  <button 
                    onClick={() => setIsLedgerExpanded(!isLedgerExpanded)}
                    className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {isLedgerExpanded ? <><ChevronUp size={12}/> Hide</> : <><ChevronDown size={12}/> Details</>}
                  </button>
                </div>

                {/* 1. GROSS REVENUE */}
                <div className="flex justify-between text-xs"><span className="text-gray-400"><InfoTip termKey="grossRevenue" label="Gross Revenue" /></span><span className="text-green-400">+${(financialReport.revenue / 1000000).toFixed(2)}M</span></div>
                
                {/* 2. TOTAL EXPENSES (Expandable) */}
                <div className="flex justify-between text-xs"><span className="text-gray-400"><InfoTip termKey="totalExpenses" label="Total Expenses" /></span><span className="text-red-400">-${(totalExpenses / 1000000).toFixed(2)}M</span></div>
                {isLedgerExpanded && (
                  <div className="pl-2 border-l-2 border-gray-700 flex flex-col gap-1 my-1">
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500"><InfoTip termKey="opex" label="Plant OpEx" /></span><span className="text-red-400/70">-${(financialReport.opex / 1000000).toFixed(2)}M</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500"><InfoTip termKey="tandd" label="T&D Overhead" /></span><span className="text-red-400/70">-${(financialReport.tandd / 1000000).toFixed(2)}M</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-gray-500"><InfoTip termKey="pilotDividend" label="City Pilot Dividend (5%)" /></span><span className="text-red-400/70">-${(financialReport.pilot / 1000000).toFixed(2)}M</span></div>
                  </div>
                )}

                {/* 3. DEBT SERVICE */}
                <div className="flex justify-between text-xs"><span className="text-gray-400"><InfoTip termKey="debtService" label="Debt Service" /></span><span className="text-red-400">-${(financialReport.debt / 1000000).toFixed(2)}M</span></div>
                
                {/* 4. TOTAL PENALTIES (Expandable) */}
                {totalPenalties > 0 && (
                  <>
                    <div className="flex justify-between text-xs"><span className="text-gray-400"><InfoTip termKey="penalties" label="Penalties & Fines" /></span><span className="text-red-500 font-bold">-${(totalPenalties / 1000000).toFixed(2)}M</span></div>
                    {isLedgerExpanded && (
                      <div className="pl-2 border-l-2 border-red-900/50 flex flex-col gap-1 my-1">
                        {financialReport.voll > 0 && <div className="flex justify-between text-[10px]"><span className="text-red-500/70"><InfoTip termKey="voll" label="Blackout VOLL" /></span><span className="text-red-500">-${(financialReport.voll / 1000000).toFixed(2)}M</span></div>}
                        {financialReport.curtailment > 0 && <div className="flex justify-between text-[10px]"><span className="text-orange-500/70"><InfoTip termKey="curtailment" label="Curtailment Waste" /></span><span className="text-orange-500">-${(financialReport.curtailment / 1000000).toFixed(2)}M</span></div>}
                        {financialReport.fines > 0 && <div className="flex justify-between text-[10px]"><span className="text-purple-500/70"><InfoTip termKey="carbonFines" label="Carbon Fines" /></span><span className="text-purple-500">-${(financialReport.fines / 1000000).toFixed(2)}M</span></div>}
                      </div>
                    )}
                  </>
                )}

                {/* BOTTOM LINE */}
                <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-800 font-bold"><span className="text-gray-300"><InfoTip termKey="netCashFlow" label="Net Cash Flow" /></span><span className={cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}>{cashFlow >= 0 ? '+' : '-'}${Math.abs(cashFlow / 1000000).toFixed(2)}M</span></div>
             </div>
           </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-2">
            {constructionQueue.length === 0 ? (
              <div className="text-xs text-gray-500 italic text-center mt-4">No active projects</div>
            ) : (
              constructionQueue.map((project, i) => (
                <div key={i} className="bg-gray-950 border border-gray-800 p-2 flex justify-between items-center">
                  <span className="text-xs text-yellow-400 uppercase tracking-widest font-bold">{project.type} ({project.capacity}MW)</span>
                  <span className="text-xs text-gray-400">{project.monthsLeft} Mo left</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}