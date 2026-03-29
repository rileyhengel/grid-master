import React, { useState } from 'react';

export default function OperationsManual({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('mechanical');

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-gray-950/90 backdrop-blur-sm flex items-center justify-center p-6 font-mono">
      <div className="bg-gray-900 border border-gray-600 w-full max-w-5xl h-full max-h-[85vh] flex flex-col shadow-2xl rounded-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-950 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold tracking-widest text-green-400 uppercase">Operations Manual</h2>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Field Guide // How to not get fired</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-red-900/50 px-4 py-2 border border-gray-700 hover:border-red-500 transition-colors uppercase text-sm font-bold tracking-widest"
          >
            Close Manual
          </button>
        </div>

        {/* Layout: Sidebar Tabs + Content Area */}
        <div className="flex flex-1 min-h-0">
          
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col p-4 gap-2 flex-shrink-0">
            <button 
              onClick={() => setActiveTab('mechanical')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'mechanical' ? 'bg-blue-900/40 text-blue-400 border-l-2 border-blue-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              1. Power Plants
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'finance' ? 'bg-purple-900/40 text-purple-400 border-l-2 border-purple-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              2. City Finance
            </button>
            <button 
              onClick={() => setActiveTab('urban')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'urban' ? 'bg-orange-900/40 text-orange-400 border-l-2 border-orange-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              3. Land & Space
            </button>
            <button 
              onClick={() => setActiveTab('ethics')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'ethics' ? 'bg-green-900/40 text-green-400 border-l-2 border-green-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              4. Public Approval
            </button>
          </div>

          {/* Scrolling Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-900 text-gray-300 text-sm leading-relaxed">
            
            {activeTab === 'mechanical' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-blue-900 pb-2 uppercase tracking-widest">Power Plants & Grid Physics</h3>
                <p>The grid is a giant balancing act. You have to match your power supply to the city's demand every single hour of the day.</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-950 p-4 border border-gray-800">
                    <h4 className="font-bold text-white mb-2 uppercase">The Heavy Lifters vs. The Peakers</h4>
                    <p>Heavy plants (like Nuclear and Coal) take a long time to build, but they provide massive, steady power around the clock. Backup plants (like Gas Peakers) can turn on instantly to catch sudden demand spikes, but their fuel is incredibly expensive. Relying entirely on Gas to run your city will quickly bankrupt you.</p>
                  </div>

                  <div className="bg-gray-950 p-4 border border-gray-800">
                    <h4 className="font-bold text-white mb-2 uppercase">The Weather Problem</h4>
                    <p>Wind and Solar power are cheap and clean, but they are entirely at the mercy of the weather. A cloudy day or a sudden drop in the wind will instantly slash your power generation. You must always have backup plants or batteries ready to catch the grid when the weather turns bad.</p>
                  </div>

                  <div className="bg-gray-950 p-4 border border-gray-800">
                    <h4 className="font-bold text-white mb-2 uppercase">How Batteries Work</h4>
                    <p>Your battery fleet is fully automated. When your wind and solar panels generate more power than the city needs, the batteries charge up. When demand spikes in the evening, the batteries discharge to keep the lights on. However, batteries aren't perfect: every time you charge and drain them, you lose about 15% of that power to heat.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-purple-400 mb-4 border-b border-purple-900 pb-2 uppercase tracking-widest">Managing the Budget</h3>
                <p>Building a clean grid costs billions. If you mismanage the city's money, the banks will cut you off and you will lose the game.</p>
                
                <ul className="space-y-4">
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Building vs. Running Costs</strong>
                    Clean energy (Solar/Wind/Nuclear) costs a fortune to build upfront, but is virtually free to run every day. Fossil fuels (Coal/Gas) are dangerously tempting because they are cheap to build, but buying fuel for them every single month will slowly bleed your budget dry.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Debt Trap</strong>
                    To afford clean energy, you will need to take out Municipal Bonds (loans). Every loan requires a monthly interest payment. If you borrow too much and your cash reserves drop too low, Wall Street will downgrade your credit rating to JUNK. Once that happens, new loans become so expensive that you will be trapped in debt forever.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Cost of Blackouts</strong>
                    Blackouts aren't just bad for PR; they are financially devastating. The government will fine you $1,000 for every megawatt-hour of power you fail to deliver during a blackout. A single bad month can wipe out your treasury.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'urban' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-orange-400 mb-4 border-b border-orange-900 pb-2 uppercase tracking-widest">City Land & Protests</h3>
                <p>Power plants take up physical space, and you only have so much land available inside the city limits.</p>
                
                <ul className="space-y-4">
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Running Out of Space</strong>
                    Nuclear and Gas plants are incredibly compact. Renewables are sprawling. Solar farms require 7 times more land than Nuclear, and Wind farms require 40 times more land. You only have 5,000 acres of local land to build on.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Long-Distance Penalty</strong>
                    Once you use up your 5,000 acres of city land, you are forced to build your new wind and solar farms far out in the countryside. This triggers an immediate, multi-million dollar penalty fee to build long-distance transmission wires to connect them back to the city.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Local Protests</strong>
                    Citizens want the lights on, but nobody wants a dirty power plant in their backyard. If you build new Coal or Gas plants inside the city limits, it will trigger immediate protests and severely damage your Public Approval.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'ethics' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-green-400 mb-4 border-b border-green-900 pb-2 uppercase tracking-widest">Keeping Your Job</h3>
                <p>As the Grid Master, you serve the public. You have to balance three conflicting goals. If your overall Approval Rating drops below 15%, the Mayor will fire you and the game ends.</p>
                
                <ul className="space-y-4">
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Keep Prices Low</strong>
                    If you violently hike electricity prices (the Retail Rate) to pay for your shiny new solar panels, the citizens will revolt. Keep prices steady, or drop them when you have a surplus of cheap green energy, to keep the public happy.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Keep the Lights On</strong>
                    Blackouts are a public safety hazard. If you tear down your coal plants too fast without building enough batteries or backup gas to replace them, the city will go dark and your approval rating will instantly crash.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Hit Net Zero</strong>
                    You are legally required to reach 0.00 carbon emissions by Year 30. Look at the Regulatory Target at the top of your screen. If your emissions stay above that line, the government will bury you in carbon fines until you go bankrupt.
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}