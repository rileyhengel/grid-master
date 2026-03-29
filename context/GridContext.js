import React, { createContext, useState, useContext, useEffect } from 'react';

const GridContext = createContext();

const DAILY_DEMAND_PROFILE = [
  520, 480, 450, 450, 460, 500, 580, 670, 740, 780, 810, 830, 
  840, 850, 860, 880, 920, 970, 1000, 980, 940, 860, 740, 610
];

export const GridProvider = ({ children }) => {
  const [financialReport, setFinancialReport] = useState({ revenue: 0, taxes: 0, opex: 0, debt: 0 });
  const [month, setMonth] = useState(1);
  const [cash, setCash] = useState(500000000); 
  const [co2, setCo2] = useState(0);
  const [reliability, setReliability] = useState(100);
  const [affordabilityIdx, setAffordabilityIdx] = useState(100);
  const [reliabilityIdx, setReliabilityIdx] = useState(100);
  const [environmentIdx, setEnvironmentIdx] = useState(100);
  const compositeApproval = (affordabilityIdx * 0.4) + (reliabilityIdx * 0.4) + (environmentIdx * 0.2);
  const [eventLog, setEventLog] = useState([{ m: 1, text: "Month 1: Winter Freeze. Solar output reduced." }]);
  const [retailRate, setRetailRate] = useState(0.16);
  const [lastRetailRate, setLastRetailRate] = useState(0.16); 
  const [cashFlow, setCashFlow] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); 
  const [constructionQueue, setConstructionQueue] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [creditRating, setCreditRating] = useState('AAA');
  const [demandMultiplier, setDemandMultiplier] = useState(1.0);
  const [consecutiveGoodMonths, setConsecutiveGoodMonths] = useState(0);
  const [gameStatus, setGameStatus] = useState('start_screen'); 
  const [blackoutCount, setBlackoutCount] = useState(0);
  
  const [tutorialStep, setTutorialStep] = useState(1);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [previewAction, setPreviewAction] = useState(null); 

  // NEW: Version 1.1 State Trackers
  const [consecutiveLowApproval, setConsecutiveLowApproval] = useState(0);
  const [consecutiveCarbonFails, setConsecutiveCarbonFails] = useState(0);

  // NEW: Price Elasticity Formula (Demand drops 2.5% for every 10% rate increase over 0.16 baseline)
  const elasticityFactor = retailRate > 0.16 ? Math.max(0.5, 1 - ((retailRate - 0.16) / 0.016) * 0.025) : 1.0;
  const effectiveDemandMultiplier = demandMultiplier * elasticityFactor;

  const startGame = () => {
    setGameStatus('playing');
    setTutorialStep(0); 
    setEventLog([{ m: 1, text: "Month 1: You are now the Grid Master. Keep the lights on." }]);
  };

  const startTutorial = () => {
    setGameStatus('tutorial');
    setTutorialStep(1); 
    setIsPlaying(false); 
    setEventLog([{ m: 1, text: "Month 1: Tutorial Mode Engaged. Time is frozen." }]);
  };

  const startingCo2 = (500 * 1.0 * 730) + (400 * 0.6 * 730);
  const startingMWh = 1000 * 730;
  const startingIntensity = startingCo2 / startingMWh;
  
  const [baselineIntensity, setBaselineIntensity] = useState(startingIntensity);
  const [currentIntensity, setCurrentIntensity] = useState(startingIntensity);

  const [fleet, setFleet] = useState({
    coal: 500, gas: 400, ccg: 0, nuclear: 200, solar: 0, wind: 0, storage: 0 
  });

  const endMonth = () => {
    if (month > 360) return;
    let currentLog = `Month ${month + 1} System Check. `;
    let currentDemandMultiplier = effectiveDemandMultiplier;
    let solarMultiplier = 1.0 - (Math.random() * 0.3); 
    let windMultiplier = 1.0 - (Math.random() * 0.4);  

    setWeatherModifiers({ solar: solarMultiplier, wind: windMultiplier });

    if (solarMultiplier < 0.75) currentLog += "WEATHER: Heavy clouds. Solar power dropped. ";
    if (windMultiplier < 0.7) currentLog += "WEATHER: Low wind. Turbine power reduced. ";

    if (month + 1 === 7 || month + 1 === 19) {
      currentDemandMultiplier *= 1.15;
      currentLog += "WARNING: Summer Heatwave! Citizens are blasting air conditioning. ";
    } else if (month + 1 === 1) { 
      solarMultiplier *= 0.8;
    }

    let activeCoal = fleet.coal;
    let activeGas = fleet.gas;
    let activeCCG = fleet.ccg;
    if (Math.random() < 0.05) {
      activeCoal = Math.max(0, fleet.coal - 100); 
      currentLog += "ALERT: A coal plant broke down! ";
    }
    if (Math.random() < 0.05) {
      activeGas = Math.max(0, fleet.gas - 50); 
      currentLog += "ALERT: A gas peaker was taken offline for emergency repairs! ";
    }

    const peakDemand = 1000 * currentDemandMultiplier;
    const supply = activeCoal + activeCCG + activeGas + fleet.nuclear + (fleet.solar * solarMultiplier) + (fleet.wind * windMultiplier) + fleet.storage;
    
    const deliveredMW = Math.min(supply, peakDemand);
    const deliveredMWh = deliveredMW * 730; 
    const grossRevenue = deliveredMWh * (retailRate * 1000); 
    
    const sprawlMultiplier = 1 + (Math.max(0, (usedLand - 1000) / totalLand) * 0.2);
    const tanddOverhead = deliveredMWh * 50 * sprawlMultiplier;

    const variableOpEx = (activeCoal * 730 * 85) + (activeGas * 730 * 110) + (activeCCG * 730 * 40) + (fleet.nuclear * 730 * 10);
    const fixedOpEx = (fleet.solar * (20000 / 12)) + (fleet.wind * (35000 / 12)) + (fleet.storage * (30000 / 12));
    const totalOpEx = variableOpEx + fixedOpEx;

    let dailyEUE = 0;
    let dailyCurtailment = 0;
    const maxStorageCapacity = fleet.storage * 4; 
    let simulatedCharge = 0;

    for (let i = 0; i < 24; i++) {
      let d = DAILY_DEMAND_PROFILE[i] * currentDemandMultiplier;
      
      let sOutput = 0;
      if (i >= 7 && i <= 18) sOutput = fleet.solar * Math.sin((i - 7) * Math.PI / 11) * solarMultiplier;
      let wOutput = fleet.wind * (0.30 + (0.15 * Math.sin(i * 0.8)) + (0.05 * Math.cos(i * 2))) * windMultiplier;
      let baseload = activeCoal + activeCCG + activeGas + fleet.nuclear;
      let netLoad = d - (sOutput + wOutput + baseload);
      
      if (netLoad < 0) {
        simulatedCharge = Math.min(maxStorageCapacity, simulatedCharge + Math.abs(netLoad));
      } else if (netLoad > 0) {
        let discharge = Math.min(simulatedCharge, fleet.storage, netLoad);
        simulatedCharge -= discharge;
      }
    }

    let activeCharge = simulatedCharge; 
    for (let i = 0; i < 24; i++) {
      let d = DAILY_DEMAND_PROFILE[i] * currentDemandMultiplier;
      
      let sOutput = 0;
      if (i >= 7 && i <= 18) sOutput = fleet.solar * Math.sin((i - 7) * Math.PI / 11) * solarMultiplier;
      let wOutput = (fleet?.wind || 0) * (0.30 + (0.15 * Math.sin(i * 0.8)) + (0.05 * Math.cos(i * 2))) * weatherModifiers.wind; 
      let baseload = activeCoal + activeCCG + activeGas + fleet.nuclear;
      let netLoad = d - (sOutput + wOutput + baseload);

      if (netLoad < 0) {
        let spaceLeft = maxStorageCapacity - activeCharge;
        let chargeAmount = Math.min(spaceLeft, Math.abs(netLoad));
        activeCharge += chargeAmount;
        let excess = Math.abs(netLoad) - chargeAmount;
        if (excess > 0) dailyCurtailment += excess; 
      } else if (netLoad > 0) {
        let discharge = Math.min(activeCharge, fleet.storage, netLoad);
        activeCharge -= discharge;
        let unserved = netLoad - discharge;
        if (unserved > 0) dailyEUE += unserved; 
      }
    }

    let eueMWh = dailyEUE * 30.4;
    let vollPenalty = eueMWh * 1000; 
    if (eueMWh > 0) {
      currentLog += `BLACKOUT: Demand exceeded supply! You paid an emergency penalty of -$${(vollPenalty/1000000).toFixed(2)}M. `;
    }

    let curtailmentPenalty = dailyCurtailment * 30.4 * 20; 
    const pilotDividend = grossRevenue * 0.05;
    const netCashFlow = grossRevenue - tanddOverhead - totalOpEx - curtailmentPenalty - pilotDividend - vollPenalty;

    let newlyBuilt = { coal: 0, gas: 0, ccg: 0, nuclear: 0, solar: 0, wind: 0, storage: 0 };
    const updatedQueue = constructionQueue.map(p => ({ ...p, monthsLeft: p.monthsLeft - 1 }));
    const finishedProjects = updatedQueue.filter(p => p.monthsLeft <= 0);
    const remainingQueue = updatedQueue.filter(p => p.monthsLeft > 0);

    finishedProjects.forEach(p => {
      newlyBuilt[p.type] += p.capacity;
      currentLog += `CONSTRUCTION FINISHED: ${p.capacity}MW of ${p.type} is now generating power. `;
    });

    const healthModifier = (reliability / 100) * (0.12 / retailRate);
    const taxRevenue = 5000000 * healthModifier; 
    
    let currentDebtService = 0;
    const updatedBonds = bonds.map(b => {
      currentDebtService += b.monthlyPayment;
      return { ...b, monthsLeft: b.monthsLeft - 1 };
    }).filter(b => b.monthsLeft > 0); 

    let newRating = creditRating;
    if (reliability < 90 || netCashFlow < -1000000) {
       if (creditRating === 'AAA') newRating = 'AA';
       else if (creditRating === 'AA') newRating = 'A';
       else if (creditRating === 'A') newRating = 'BBB';
       else if (creditRating === 'BBB') newRating = 'JUNK';
    } else if (reliability >= 98 && netCashFlow > 2000000) {
       if (creditRating === 'JUNK') newRating = 'BBB';
       else if (creditRating === 'BBB') newRating = 'A';
       else if (creditRating === 'A') newRating = 'AA';
       else if (creditRating === 'AA') newRating = 'AAA';
    }

    setFleet(prev => ({
      ...prev,
      nuclear: prev.nuclear + newlyBuilt.nuclear,
      solar: prev.solar + newlyBuilt.solar,
      wind: prev.wind + newlyBuilt.wind,
      storage: prev.storage + newlyBuilt.storage,
      gas: prev.gas + newlyBuilt.gas,
      ccg: prev.ccg + newlyBuilt.ccg
    }));
    
    setConstructionQueue(remainingQueue);
    setBonds(updatedBonds);
    setCreditRating(newRating);
    
    const monthlyMWh = peakDemand * 730;
    const currentMonthlyCo2 = (activeCoal * 1.0 * 730) + (activeCCG * 0.4 * 730) + (activeGas * 0.6 * 730);
    setCo2(prev => prev + currentMonthlyCo2);
    
    const intensity = currentMonthlyCo2 / monthlyMWh;
    setCurrentIntensity(intensity);

    const target = getCarbonTarget(month);
    let carbonFine = 0;
    
    // NEW: Progressive Geometric Fines
    let nextConsecutiveCarbonFails = consecutiveCarbonFails;
    if (intensity > target && month > 12) {
      nextConsecutiveCarbonFails += 1;
      const excessIntensity = intensity - target;
      const totalExcessTons = excessIntensity * monthlyMWh;
      const penaltyRate = month <= 120 ? 50 : month <= 240 ? 150 : 500;
      const baseFine = totalExcessTons * penaltyRate;
      
      carbonFine = baseFine * Math.pow(1.15, nextConsecutiveCarbonFails - 1);
      currentLog += `EMISSIONS FINE: Target failed for ${nextConsecutiveCarbonFails} month(s). Fined -$${(carbonFine/1000000).toFixed(2)}M. `;
    } else {
      nextConsecutiveCarbonFails = 0;
    }
    setConsecutiveCarbonFails(nextConsecutiveCarbonFails);

    // NEW: Affordability with aggressive 10% compounding decay if Rate > 50% baseline
    let nextAffordability = affordabilityIdx;
    if (retailRate > 0.20) {
      nextAffordability *= (1-0.10*(retailRate-19)/6); 
      currentLog += "PUBLIC OUTRAGE: Energy prices are crippling the city. Approval plummeting! ";
    } else if (retailRate > lastRetailRate) {
      const rateHike = (retailRate - lastRetailRate) * 100;
      nextAffordability = Math.max(0, nextAffordability - (rateHike * 8)); 
    } else if (retailRate <= 0.12) {
      nextAffordability = Math.min(100, nextAffordability + 1.5); 
    }
    setAffordabilityIdx(nextAffordability);

    let nextReliability = reliabilityIdx;
    if (eueMWh > 0) {
      const reliabilityHit = (eueMWh / (peakDemand * 730)) * 1000; 
      nextReliability = Math.max(0, nextReliability - reliabilityHit);
      setBlackoutCount(prev => prev + 1); 
    } else {
      nextReliability = Math.min(100, nextReliability + 2.0);
    }
    setReliabilityIdx(nextReliability);

    let nextEnvironment = environmentIdx;
    if (intensity > getCarbonTarget(month)) {
      nextEnvironment = Math.max(0, nextEnvironment - 2.5); 
    } else {
      nextEnvironment = Math.min(100, nextEnvironment + 1.0); 
    }
    setEnvironmentIdx(nextEnvironment);

    // NEW: "Recall Election" Political Fail State (6 Months under 25%)
    const nextComposite = (nextAffordability * 0.4) + (nextReliability * 0.4) + (nextEnvironment * 0.2);
    let nextConsecutiveLowApproval = consecutiveLowApproval;
    
    if (nextComposite < 50) {
      nextConsecutiveLowApproval += 1;
      currentLog += `WARNING: Approval critically low (${nextConsecutiveLowApproval}/6 months). Recall imminent! `;
    } else {
      nextConsecutiveLowApproval = 0;
    }
    setConsecutiveLowApproval(nextConsecutiveLowApproval);

    if (nextComposite < 40 || nextConsecutiveLowApproval >= 6) {
      setIsPlaying(false);
      currentLog += "GAME OVER: You have been recalled from office due to sustained public outrage.";
    }

    setFinancialReport({ 
      revenue: grossRevenue, tandd: tanddOverhead, opex: totalOpEx, 
      curtailment: curtailmentPenalty, pilot: pilotDividend, voll: vollPenalty, 
      debt: currentDebtService, fines: carbonFine 
    });

    const finalCashFlow = netCashFlow - currentDebtService - carbonFine; 
    setCashFlow(finalCashFlow);
    setCash(prev => prev + finalCashFlow);

    let nextStreak = consecutiveGoodMonths;
    if (nextAffordability > 80 && nextReliability > 80) {
      nextStreak += 1;
    } else {
      nextStreak = 0; 
    }

    if (nextStreak >= 12) {
      setDemandMultiplier(prev => prev + 0.05);
      currentLog += `URBAN BOOM: Cheap, reliable power caused a population surge! Base demand +5%. `;
      nextStreak = 0; 
    }

    setConsecutiveGoodMonths(nextStreak);
    
    setEventLog(prev => [{ m: month + 1, text: currentLog }, ...prev]);
    setLastRetailRate(retailRate); 
    setMonth(prev => prev + 1);
  };

  const getCarbonTarget = (currentMonth) => {
    if (!baselineIntensity) return 0;
    const step = Math.floor(currentMonth / 72); 
    const reductionFactor = Math.max(0, 1 - (step * 0.2));
    return baselineIntensity * reductionFactor;
  };

  const [weatherModifiers, setWeatherModifiers] = useState({ solar: 1.0, wind: 1.0 });

  useEffect(() => {
    if (gameStatus === 'start_screen' || gameStatus === 'tutorial' || gameStatus === 'ended') return;

    // FIX: Telemetry watcher now triggers if the 6-month Recall condition is met
    if (month > 360 || cash < 0 || compositeApproval < 15 || consecutiveLowApproval >= 6) {
      setIsPlaying(false);
      setGameStatus('ended');

      const finalTarget = getCarbonTarget(month);
      const isWin = (month > 360) && (currentIntensity <= finalTarget) && (blackoutCount <= 12);
      const finalCleanCapacity = fleet.solar + fleet.wind + fleet.storage + fleet.nuclear;

      const payload = {
        win_status: isWin,
        final_cash: Math.round(cash),
        blackout_count: blackoutCount,
        retail_rate: retailRate,
        clean_capacity: finalCleanCapacity,
        end_month: month > 360 ? 360 : month,
        final_carbon_intensity: Number(currentIntensity.toFixed(2))
      };

      const cleanUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim() : "";

      if (cleanUrl && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        fetch(`${cleanUrl}/rest/v1/game_results`, {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
           if (!response.ok) console.error("Supabase Rejected:", response.status);
           else console.log("Telemetry Sent Successfully!");
        })
        .catch(err => console.error("Telemetry fetch error:", err));
      }
    }
  }, [month, cash, compositeApproval, gameStatus, currentIntensity, blackoutCount, fleet, retailRate, consecutiveLowApproval]); 

  const totalLand = 5000; 
  const landUsage = { nuclear: 1, ccg: 1.5, gas: 1, coal: 1.5, storage: 0.1, solar: 7, wind: 40 };

  const fleetLand = (fleet.nuclear * landUsage.nuclear) + (fleet.gas * landUsage.gas) + (fleet.ccg * landUsage.ccg) + (fleet.coal * landUsage.coal) + 
                    (fleet.storage * landUsage.storage) + (fleet.solar * landUsage.solar) + (fleet.wind * landUsage.wind);
  
  const queuedLand = constructionQueue.reduce((acc, project) => acc + (project.capacity * landUsage[project.type]), 0);
  
  const usedLand = fleetLand + queuedLand;
  
  const buildPlant = (type, baseCost, capacity) => {
    const requiredLand = capacity * landUsage[type];
    const isRemote = (usedLand + requiredLand) > totalLand;
    let totalCost = baseCost;
    let eventMsg = `CONSTRUCTION STARTED: Building ${capacity}MW of ${type}.`;

    if (isRemote) {
      const txFee = (capacity / 100) * 30000000; 
      totalCost += txFee;
      eventMsg = `REMOTE CONSTRUCTION: Building ${capacity}MW of ${type}. Extra -$${(txFee/1000000).toFixed(0)}M paid for long-distance wires.`;
    }

    if (cash >= totalCost) {
      setCash(prev => prev - totalCost);
      const delays = { solar: 12, storage: 12, wind: 24, gas: 36, ccg: 48, nuclear: 120, coal: 0 };
      setConstructionQueue(prev => [...prev, { type, capacity, monthsLeft: delays[type] }]);
      
      if (!isRemote && (type === 'gas' || type === 'ccg' || type === 'coal' || type === 'nuclear')) {
        setEnvironmentIdx(prev => Math.max(0, prev - 15));
        eventMsg += ` LOCAL PROTESTS: Citizens are angry about the new ${type} plant!`;
      }
      setEventLog(prev => [{ m: month, text: eventMsg }, ...prev]);
    } else {
      setEventLog(prev => [{ m: month, text: `BANKRUPTCY WARNING: Not enough money to build ${type}.` }, ...prev]);
    }
  };

  const decommissionPlant = (type, fee, capacity) => {
    if (cash >= fee && fleet[type] >= capacity) {
      setCash(prev => prev - fee);
      setFleet(prev => ({ ...prev, [type]: prev[type] - capacity }));
      setEventLog(prev => [{ m: month, text: `DEMOLISHED: ${capacity}MW of ${type} safely removed.` }, ...prev]);
    }
  };

  const getInterestRate = (rating) => {
    const baseRate = 0.04; 
    const rates = { 'AAA': baseRate, 'AA': baseRate + 0.002, 'A': baseRate + 0.006, 'BBB': baseRate + 0.013, 'JUNK': baseRate + 0.03 };
    return rates[rating] || 0.05;
  };

  const issueBond = (amount, years) => {
    const rate = getInterestRate(creditRating);
    const monthlyRate = rate / 12;
    const numPayments = years * 12;
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    setBonds(prev => [...prev, { amount, rate, years, monthsLeft: numPayments, monthlyPayment }]);
    setCash(prev => prev + amount);
    setEventLog(prev => [{ m: month, text: `LOAN SECURED: Borrowed $${amount/1000000}M at ${(rate*100).toFixed(1)}% interest.` }, ...prev]);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && month <= 360 && cash >= 0 && compositeApproval >= 15 && consecutiveLowApproval < 6) {
      interval = setInterval(() => {
        endMonth();
      }, playSpeed);
    } else if (isPlaying) {
      setIsPlaying(false); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, month, cash, compositeApproval, consecutiveLowApproval]); 
  
  const togglePlay = () => setIsPlaying(!isPlaying);
  const cycleSpeed = () => setPlaySpeed(prev => prev === 1000 ? 250 : prev === 250 ? 50 : 1000);

  return (
    <GridContext.Provider value={{ 
      month, cash, co2, fleet, eventLog, 
      baselineIntensity, currentIntensity, endMonth, buildPlant,
      retailRate, setRetailRate, cashFlow, decommissionPlant,
      isPlaying, playSpeed, togglePlay, cycleSpeed, 
      constructionQueue, bonds, creditRating, financialReport,
      getCarbonTarget, usedLand, totalLand, landUsage,
      compositeApproval, affordabilityIdx, reliabilityIdx, 
      environmentIdx, issueBond, demandMultiplier,
      gameStatus, startGame, startTutorial, blackoutCount, 
      tutorialStep, setTutorialStep, weatherModifiers,
      isManualOpen, setIsManualOpen, previewAction, setPreviewAction,
      effectiveDemandMultiplier, consecutiveLowApproval // Exposed for the UI files
    }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => useContext(GridContext);