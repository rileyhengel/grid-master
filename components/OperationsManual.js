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
            <h2 className="text-2xl font-bold tracking-widest text-green-400 uppercase">Grid Master Codex</h2>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Authorized Personnel Only // Operations & Ethics Manual</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-red-900/50 px-4 py-2 border border-gray-700 hover:border-red-500 transition-colors uppercase text-sm font-bold tracking-widest"
          >
            Close Terminal
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
              1. Mechanical Systems
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'finance' ? 'bg-purple-900/40 text-purple-400 border-l-2 border-purple-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              2. Corporate Finance
            </button>
            <button 
              onClick={() => setActiveTab('urban')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'urban' ? 'bg-orange-900/40 text-orange-400 border-l-2 border-orange-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              3. Urban Planning
            </button>
            <button 
              onClick={() => setActiveTab('ethics')}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors ${activeTab === 'ethics' ? 'bg-green-900/40 text-green-400 border-l-2 border-green-500 font-bold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
            >
              4. Public Ethics
            </button>
          </div>

          {/* Scrolling Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-900 text-gray-300 text-sm leading-relaxed">
            
            {activeTab === 'mechanical' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-blue-900 pb-2 uppercase tracking-widest">Mechanical Systems & Control Logic</h3>
                <p>The grid is the largest and most complex machine ever built. To balance supply and demand in real-time, operators must understand the thermodynamics and automated control loops that govern their assets.</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-950 p-4 border border-gray-800">
                    <h4 className="font-bold text-white mb-2 uppercase">The Thermodynamics of Dispatch</h4>
                    <p>Thermal plants are bound by the laws of physics. Baseload assets (like Nuclear and Coal) rely on massive steam cycles that take days to reach operational temperatures; they must run constantly to avoid thermal stress fractures. Conversely, Gas Peakers utilize aeroderivative combustion turbines (essentially stationary jet engines). They can spin up in minutes to catch evening demand spikes, but this mechanical agility comes at a brutal loss of fuel efficiency.</p>
                  </div>

                  <div className="bg-gray-950 p-4 border border-gray-800">
                    <h4 className="font-bold text-white mb-2 uppercase">The Intermittency Problem</h4>
                    <p className="mb-2">Renewable generation is fundamentally hostage to weather RNG. Wind output does not scale linearly; it scales with the cube of wind velocity, governed by the formula:</p>
                    <div className="text-center text-blue-300 font-bold my-4 bg-gray-900 py-3 rounded-sm font-serif text-lg tracking-wider">
                      P<sub className="text-[10px] ml-[1px]">wind</sub> = &frac12; &rho; A v<sup className="text-[10px]">3</sup> &middot; C<sub className="text-[10px]">p</sub>
                    </div>
                    <p>Because velocity is cubed, even a slight drop in the daily wind sine wave causes a massive crash in Megawatt output. Similarly, heavy cloud cover introduces a random variable that can instantly slash solar irradiance by 20%, requiring immediate automated dispatch corrections.</p>
                  </div>

                  <div className="bg-gray-950 p-4 border border-gray-800">
                    <h4 className="font-bold text-white mb-2 uppercase">Storage Control Loops</h4>
                    <p className="mb-2">Your lithium-ion fleet operates on a strict, automated 2-pass logic loop. In Pass 1, if generation exceeds demand, the system charges the batteries. In Pass 2, if generation falls below demand, it discharges them strictly to prevent a blackout. Players must account for the 4-hour capacity limit and the inherent thermodynamic penalty of round-trip efficiency ({`$\\eta_{RT}=0.85$`}), meaning:</p>
                    <div className="text-center text-green-300 font-bold my-4 bg-gray-900 py-3 rounded-sm font-serif text-lg tracking-wider">
                      E<sub className="text-[10px] ml-[1px]">out</sub> = E<sub className="text-[10px] ml-[1px]">in</sub> &times; 0.85
                    </div>
                    <p>Every time you cycle a battery, 15% of that energy is lost to heat.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-purple-400 mb-4 border-b border-purple-900 pb-2 uppercase tracking-widest">Utility Corporate Finance</h3>
                <p>Building a Net Zero grid is not just an engineering challenge; it is a brutal test of corporate finance. Every megawatt of capacity requires staggering capital, and poor financial structuring will end your tenure before the physics do.</p>
                
                <ul className="space-y-4">
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">CapEx vs. OpEx</strong>
                    This is the core financial trap of the game. Renewables demand massive upfront Capital Expenditures (CapEx) but have near-zero Operational Expenditures (OpEx). Fossil fuels look dangerously appealing because they are cheap to build, but their daily OpEx (fuel burn and maintenance) will slowly bleed your treasury dry.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Bond Market Death Spiral</strong>
                    To fund billion-dollar infrastructure, you must issue Municipal Bonds. Every $100M borrowed locks your utility into a relentless 10-year debt service. If your net cash flow drops—due to overbuilding or operational waste—Wall Street will downgrade your credit rating from AAA down to JUNK. Once downgraded, the risk premiums on future debt become violently expensive, trapping you in a fatal debt spiral.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Value of Lost Load (VOLL)</strong>
                    A blackout is not just an inconvenience; it is a financial catastrophe. The state regulator will fine your utility $1,000 for every single unserved Megawatt-hour. Failing to meet peak demand will bankrupt a poorly managed grid overnight.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'urban' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-orange-400 mb-4 border-b border-orange-900 pb-2 uppercase tracking-widest">Urban Planning & Spatial Constraints</h3>
                <p>The grid does not exist in a mathematical vacuum; it occupies physical space. You must navigate the geometric realities of land use and the political friction of zoning.</p>
                
                <ul className="space-y-4">
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">Land Use Geometry</strong>
                    Energy density dictates your spatial strategy. Nuclear power is incredibly dense, requiring roughly 1 acre/MW. Renewables, however, are sprawling and diffuse; Solar requires ~7 acres/MW, and Onshore Wind demands up to 40 acres/MW of territorial footprint.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The T&D Sprawl Penalty</strong>
                    Your local municipal zone only contains 5,000 acres of buildable land. Once you consume this geometry, you are forced to build far outside city limits. This triggers immediate, multimillion-dollar interconnection fees and permanently inflates your monthly Transmission & Distribution (T&D) maintenance costs due to line losses over distance.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">NIMBY Backlash</strong>
                    Siting heavily polluting assets inside the local municipal zone triggers immediate community backlash. Citizens demand reliable power, but dropping a gas peaker in their backyard will destroy your public approval ratings and invite crippling regulatory scrutiny.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'ethics' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-green-400 mb-4 border-b border-green-900 pb-2 uppercase tracking-widest">The Ethics of Public Power</h3>
                <p>A utility operator does not just balance a spreadsheet; they manage the lifeblood of a modern polis. The Tripartite Index (Affordability, Reliability, Environment) forces you to navigate deep ethical obligations regarding social equity and justice.</p>
                
                <ul className="space-y-4">
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Affordability Mandate</strong>
                    Energy is a fundamental prerequisite for equal opportunity. Jacking up the retail rate to aggressively fund green infrastructure acts as a deeply regressive tax, disproportionately harming your most vulnerable, low-income citizens. If your rates violate the principles of distributive justice—where inequalities fail to benefit the least advantaged—the game will severely punish your public standing.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Reliability Mandate</strong>
                    A functioning society requires a stable foundation for human flourishing. Blackouts are not merely financial failures; they are severe public safety hazards that disrupt hospitals, infrastructure, and lives. You must transition to volatile renewables while upholding the absolute moral imperative of keeping the lights on.
                  </li>
                  <li className="bg-gray-950 p-4 border border-gray-800">
                    <strong className="text-white block mb-1 uppercase tracking-wider">The Net Zero Mandate</strong>
                    You are bound by the ethics of intergenerational justice. The mandate to reach 0.00 Tons/MWh by Year 30 is a strict regulatory curve designed to prevent long-term environmental collapse. It is not a suggestion; ignoring it will trigger escalating carbon fines that will swiftly bankrupt your utility.
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