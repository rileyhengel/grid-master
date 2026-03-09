import { useGrid } from '../context/GridContext';

export default function PerformanceReview() {
  const { currentIntensity, creditRating, blackoutCount, cash, getCarbonTarget } = useGrid();
  
  const finalTarget = getCarbonTarget(360);
  const metNetZero = currentIntensity <= finalTarget;
  const isBankrupt = creditRating === 'JUNK' || cash < 0;
  
  // Dynamic Ending Evaluation
  let title = "";
  let description = "";
  let color = "";

  if (metNetZero && !isBankrupt && blackoutCount < 5) {
    title = "THE UTOPIAN GRID";
    description = "You engineered a flawless transition. The air is clean, the city's finances are thriving, and the grid is bulletproof. You are a legend in modern urban design.";
    color = "text-blue-400";
  } else if (metNetZero && isBankrupt) {
    title = "THE COSTLY GREEN";
    description = "We are officially Net Zero, but the city is practically bankrupt. The environment is saved, but the taxpayers will be paying off your massive municipal bonds for a century.";
    color = "text-yellow-500";
  } else if (!metNetZero) {
    title = "THE FOSSIL RELIC";
    description = "You kept the lights on and made a fortune, but you failed the climate mandate. The city remains tethered to the past, choking on the emissions of your lucrative coal and gas plants.";
    color = "text-orange-500";
  } else {
    title = "MUNICIPAL COLLAPSE";
    description = "Between the rolling blackouts and the financial ruin, the grid has collapsed. State regulators have seized the utility.";
    color = "text-red-500";
  }

  return (
    <div className="absolute inset-0 z-50 bg-gray-950/95 flex flex-col items-center justify-center p-8 backdrop-blur-sm font-mono">
      <div className="max-w-3xl w-full border border-gray-700 bg-gray-900 p-10 shadow-2xl">
        
        <div className="text-center mb-10 border-b border-gray-800 pb-8">
          <h2 className="text-gray-500 tracking-widest text-sm mb-2">YEAR 30 / MONTH 360</h2>
          <h1 className={`text-5xl font-bold tracking-tighter mb-4 ${color}`}>{title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-gray-950 p-6 border border-gray-800">
            <div className="text-gray-500 text-xs tracking-widest mb-2">EMISSIONS</div>
            <div className={`text-2xl font-bold ${metNetZero ? 'text-green-500' : 'text-red-500'}`}>
              {currentIntensity.toFixed(2)} <span className="text-sm text-gray-400">T/MWh</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Target: {finalTarget.toFixed(2)}</div>
          </div>

          <div className="bg-gray-950 p-6 border border-gray-800">
            <div className="text-gray-500 text-xs tracking-widest mb-2">ECONOMICS</div>
            <div className={`text-2xl font-bold ${isBankrupt ? 'text-red-500' : 'text-green-500'}`}>
              {creditRating} RATING
            </div>
            <div className="text-xs text-gray-500 mt-1">${(cash / 1000000).toFixed(1)}M Liquid</div>
          </div>

          <div className="bg-gray-950 p-6 border border-gray-800">
            <div className="text-gray-500 text-xs tracking-widest mb-2">RELIABILITY</div>
            <div className={`text-2xl font-bold ${blackoutCount > 5 ? 'text-red-500' : 'text-green-500'}`}>
              {blackoutCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total Blackouts</div>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()} 
          className="mt-10 w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold tracking-widest border border-gray-600 transition-colors"
        >
          START NEW SIMULATION
        </button>

      </div>
    </div>
  );
}