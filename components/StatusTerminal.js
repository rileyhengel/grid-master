import React, { useState } from 'react';
import { useGrid } from '../context/GridContext';
import InfoTip from './InfoTip'; // <-- NEW: Imported the tooltip component

export default function StatusTerminal() {
  const { eventLog, cashFlow, constructionQueue, bonds, financialReport } = useGrid();
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="w-full flex flex-col bg-gray-900 border border-gray-700 p-4 min-h-full">
      
      {/* Tab Navigation (Locked to a horizontal row) */}
      <div className="flex justify-center gap-6 mb-4 border-b border-gray-800 pb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
        <button onClick={() => setActiveTab('events')} className={`uppercase tracking-widest text-sm ${activeTab === 'events' ? 'text-green-400 font-bold' : 'text-gray-600'}`}>Events</button>
        <button onClick={() => setActiveTab('finance')} className={`uppercase tracking-widest text-sm ${activeTab === 'finance' ? 'text-green-400 font-bold' : 'text-gray-600'}`}>Finances</button>
        <button onClick={() => setActiveTab('pipeline')} className={`uppercase tracking-widest text-sm ${activeTab === 'pipeline' ? 'text-green-400 font-bold' : 'text-gray-600'}`}>Pipeline</button>
      </div>
      
      {/* Tab Content Area (Locked to a scrolling vertical column) */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        
        {activeTab === 'events' && (
          <div className="space-y-3 text-xs">
            {eventLog.map((event, i) => (
              <div key={i} className={i === 0 ? "text-green-300 animate-pulse" : "text-green-800"}>
                <span className="font-bold">[{event.m}/360]</span> {event.text}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="text-xs flex flex-col gap-4">
            
            {/* Expandable Ledger V3 */}
            <details className="bg-gray-900 border border-gray-700 group cursor-pointer">
              <summary className="p-3 outline-none flex justify-between items-center list-none">
                <div>
                  <div className="text-gray-400 mb-1">Monthly Cash Flow <span className="text-[10px] ml-2 group-open:hidden">▼ Click to expand</span><span className="text-[10px] ml-2 hidden group-open:inline">▲ Hide</span></div>
                  <div className={`text-lg font-bold ${cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {cashFlow >= 0 ? '+' : '-'}${Math.abs(cashFlow / 1000000).toFixed(2)}M
                  </div>
                </div>
              </summary>
              <div className="p-3 pt-0 border-t border-gray-800 space-y-1 mt-1 font-mono text-[11px]">
                <div className="flex justify-between text-green-400"><span>Gross Revenue:</span> <span>+${(financialReport.revenue / 1000000).toFixed(2)}M</span></div>
                <div className="flex justify-between text-red-400"><span>T&D Overhead:</span> <span>-${(financialReport.tandd / 1000000).toFixed(2)}M</span></div>
                <div className="flex justify-between text-red-400"><span>OpEx (Fuel/Fixed):</span> <span>-${(financialReport.opex / 1000000).toFixed(2)}M</span></div>
                <div className="flex justify-between text-orange-400"><span>Curtailment Fee:</span> <span>-${(financialReport.curtailment / 1000000).toFixed(2)}M</span></div>
                <div className="flex justify-between text-purple-400"><span>City PILOT Div:</span> <span>-${(financialReport.pilot / 1000000).toFixed(2)}M</span></div>
                <div className="flex justify-between text-red-500 font-bold"><span>VOLL Penalty:</span> <span>-${(financialReport.voll ? financialReport.voll / 1000000 : 0).toFixed(2)}M</span></div>
                <div className="flex justify-between text-red-400"><span>Debt Service:</span> <span>-${(financialReport.debt / 1000000).toFixed(2)}M</span></div>
                <div className="flex justify-between text-orange-500 font-bold"><span>Carbon Fines:</span> <span>-${(financialReport.fines / 1000000).toFixed(2)}M</span></div>
              </div>
            </details>

            <div className="bg-gray-900 p-3 border border-gray-700">
              <div className="text-gray-400 mb-2 border-b border-gray-700 pb-1 text-sm tracking-wider uppercase">
                {/* APPLIED TOOLTIP */}
                <InfoTip termKey="lcoe" label="OpEx / MWh (LCOE)" />
              </div>
              <div className="space-y-2 text-xs">
                
                <div className="flex items-center">
                  {/* APPLIED TOOLTIP */}
                  <span className="w-16 text-gray-400"><InfoTip termKey="gas" label="Gas:" /></span>
                  <div className="flex-1 bg-gray-800 h-3 mx-2 rounded-sm overflow-hidden">
                    <div className="bg-orange-700 h-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="w-10 text-right text-gray-300">$100</span>
                </div>

                <div className="flex items-center">
                  {/* APPLIED TOOLTIP */}
                  <span className="w-16 text-gray-400"><InfoTip termKey="coal" label="Coal:" /></span>
                  <div className="flex-1 bg-gray-800 h-3 mx-2 rounded-sm overflow-hidden">
                    <div className="bg-gray-600 h-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="w-10 text-right text-gray-300">$85</span>
                </div>

                <div className="flex items-center">
                  {/* APPLIED TOOLTIP */}
                  <span className="w-16 text-gray-400"><InfoTip termKey="nuclear" label="Nuclear:" /></span>
                  <div className="flex-1 bg-gray-800 h-3 mx-2 rounded-sm overflow-hidden">
                    <div className="bg-purple-700 h-full" style={{width: '20%'}}></div>
                  </div>
                  <span className="w-10 text-right text-gray-300">$20</span>
                </div>

                <div className="flex items-center">
                  {/* APPLIED TOOLTIP */}
                  <span className="w-16 text-gray-400"><InfoTip termKey="wind" label="Wind:" /></span>
                  <div className="flex-1 bg-gray-800 h-3 mx-2 rounded-sm overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{width: '10%'}}></div>
                  </div>
                  <span className="w-10 text-right text-gray-300">$10</span>
                </div>

                <div className="flex items-center">
                  {/* APPLIED TOOLTIP */}
                  <span className="w-16 text-gray-400"><InfoTip termKey="solar" label="Solar:" /></span>
                  <div className="flex-1 bg-gray-800 h-3 mx-2 rounded-sm overflow-hidden">
                    <div className="bg-yellow-600 h-full" style={{width: '5%'}}></div>
                  </div>
                  <span className="w-10 text-right text-gray-300">$5</span>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-2 text-xs">
            {constructionQueue.length === 0 ? (
              <div className="text-gray-600 italic">No active projects.</div>
            ) : (
              constructionQueue.map((project, i) => (
                <div key={i} className="bg-gray-900 p-2 border border-gray-700 flex justify-between items-center">
                  <span className="text-gray-300 capitalize">{project.capacity}MW {project.type}</span>
                  <span className="text-yellow-500 font-bold">{project.monthsLeft} mo.</span>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}