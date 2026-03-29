import React, { useRef } from 'react';
import { useGrid } from '../context/GridContext';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InfoTip from './InfoTip'; 

const DAILY_DEMAND_PROFILE = [
  520, 480, 450, 450, 460, 500, 580, 670, 740, 780, 810, 830, 
  840, 850, 860, 880, 920, 970, 1000, 980, 940, 860, 740, 610
];

export default function LoadBalancer() {
  const { fleet, effectiveDemandMultiplier, weatherModifiers, previewAction, month, isColorblindMode } = useGrid();

  const yAxisMaxRef = useRef(1200);

  if (month === 1 && yAxisMaxRef.current > 1200) {
    yAxisMaxRef.current = 1200;
  }

  // NEW: Chart Specific Hex Palette
  const CHART_COLORS = {
    standard: {
      nuclear: '#7e22ce', coal: '#4b5563', ccg: '#0d9488', gas: '#f97316', // BACK TO ORANGE
      wind: '#60a5fa', solar: '#eab308', storage: '#22c55e', demand: '#ef4444'
    },
    colorblind: { // Okabe-Ito mapped to precise hex codes
      nuclear: '#0072B2', coal: '#71717A', ccg: '#56B4E9', gas: '#D55E00',
      wind: '#009E73', solar: '#F0E442', storage: '#E69F00', demand: '#CC79A7' // Magenta Demand Line
    }
  };

  const colors = isColorblindMode ? CHART_COLORS.colorblind : CHART_COLORS.standard;

  const generateData = () => {
    const data = [];
    
    let simNuclear = fleet?.nuclear || 0;
    let simCcg = fleet?.ccg || 0;
    let simCoal = fleet?.coal || 0;
    let simGas = fleet?.gas || 0;
    let simWindCap = fleet?.wind || 0;
    let simSolarCap = fleet?.solar || 0;
    let simStorage = fleet?.storage || 0;

    if (previewAction?.action === 'demolish') {
      if (previewAction.type === 'nuclear') simNuclear = Math.max(0, simNuclear - previewAction.capacity);
      if (previewAction.type === 'ccg') simCcg = Math.max(0, simCcg - previewAction.capacity);
      if (previewAction.type === 'coal') simCoal = Math.max(0, simCoal - previewAction.capacity);
      if (previewAction.type === 'gas') simGas = Math.max(0, simGas - previewAction.capacity);
      if (previewAction.type === 'wind') simWindCap = Math.max(0, simWindCap - previewAction.capacity);
      if (previewAction.type === 'solar') simSolarCap = Math.max(0, simSolarCap - previewAction.capacity);
      if (previewAction.type === 'storage') simStorage = Math.max(0, simStorage - previewAction.capacity);
    }

    if (previewAction?.action === 'build' && previewAction.type === 'storage') {
      simStorage += previewAction.capacity;
    }

    const maxStorageCapacity = simStorage * 4; 
    let simulatedCharge = 0;

    for (let i = 0; i < 24; i++) {
      let demand = DAILY_DEMAND_PROFILE[i] * (effectiveDemandMultiplier || 1.0);
      
      let windCurve = (0.30 + (0.15 * Math.sin(i * 0.8)) + (0.05 * Math.cos(i * 2))) * weatherModifiers.wind;
      let solarCurve = (i > 7 && i < 18) ? Math.sin((i - 7) * Math.PI / 10) * weatherModifiers.solar : 0;
      
      let wOut = simWindCap * windCurve;
      let sOut = simSolarCap * solarCurve;
      let supply = simNuclear + simCcg + simCoal + wOut + sOut;

      if (previewAction?.action === 'build' && previewAction.type !== 'gas' && previewAction.type !== 'storage') {
         if (['nuclear', 'ccg', 'coal'].includes(previewAction.type)) supply += previewAction.capacity;
         if (previewAction.type === 'wind') supply += previewAction.capacity * windCurve;
         if (previewAction.type === 'solar') supply += previewAction.capacity * solarCurve;
      }

      let net = demand - supply;
      if (net < 0) {
        simulatedCharge = Math.min(maxStorageCapacity, simulatedCharge + Math.abs(net));
      } else if (net > 0) {
        simulatedCharge -= Math.min(simulatedCharge, simStorage, net);
      }
    }

    let storedEnergyMWh = simulatedCharge; 
    
    for (let i = 0; i < 24; i++) {
      let demand = DAILY_DEMAND_PROFILE[i] * (effectiveDemandMultiplier || 1.0);
      
      let windCurve = (0.30 + (0.15 * Math.sin(i * 0.8)) + (0.05 * Math.cos(i * 2))) * weatherModifiers.wind;
      let solarCurve = (i > 7 && i < 18) ? Math.sin((i - 7) * Math.PI / 10) * weatherModifiers.solar : 0;
      
      let wind = simWindCap * windCurve;
      let solar = simSolarCap * solarCurve;
      
      let previewPower = 0;
      if (previewAction?.action === 'build' && previewAction.type !== 'gas' && previewAction.type !== 'storage') {
          if (['nuclear', 'ccg', 'coal'].includes(previewAction.type)) previewPower = previewAction.capacity;
          if (previewAction.type === 'wind') previewPower = previewAction.capacity * windCurve;
          if (previewAction.type === 'solar') previewPower = previewAction.capacity * solarCurve;
      }

      let currentSupply = simNuclear + simCcg + simCoal + wind + solar + previewPower;
      let storageDischarge = 0;

      if (currentSupply > demand && simStorage > 0) {
        const excess = currentSupply - demand;
        const availableRoom = maxStorageCapacity - storedEnergyMWh;
        const chargeAmount = Math.min(excess, simStorage, availableRoom);
        storedEnergyMWh += chargeAmount;
        demand += chargeAmount; 
      } else if (currentSupply < demand && storedEnergyMWh > 0) {
        const shortfall = demand - currentSupply;
        const maxDischargeMWh = storedEnergyMWh * 0.85; 
        storageDischarge = Math.min(shortfall, simStorage, maxDischargeMWh);
        storedEnergyMWh -= (storageDischarge / 0.85); 
        currentSupply += storageDischarge;
      }

      let maxGas = simGas;
      if (previewAction?.action === 'build' && previewAction.type === 'gas') {
          maxGas += previewAction.capacity;
      }

      let gas = 0;
      if (currentSupply < demand) {
        gas = Math.min(maxGas, demand - currentSupply);
      }

      const dataPoint = {
        time: `${i}:00`,
        Demand: Math.max(0, demand),
        Nuclear: Math.max(0, simNuclear),
        CCG: Math.max(0, simCcg),
        Coal: Math.max(0, simCoal),
        Wind: Math.max(0, wind),
        Solar: Math.max(0, solar),
        Storage: Math.max(0, storageDischarge),
        Gas: Math.max(0, gas)
      };

      if (previewPower > 0) {
          dataPoint.Preview = previewPower;
      }
      
      data.push(dataPoint);
    }
    return data;
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0">
      <h2 className="text-green-500 mb-4 uppercase tracking-widest border-b border-green-800 pb-2 flex-shrink-0">
        <InfoTip termKey="dispatchStack" label="Dispatch Stack (24h)" />
      </h2>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={generateData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isColorblindMode ? "#27272a" : "#064e3b"} />
            <XAxis dataKey="time" stroke={isColorblindMode ? "#a1a1aa" : "#10b981"} />
            <YAxis 
              stroke={isColorblindMode ? "#a1a1aa" : "#10b981"}
              domain={[0, dataMax => {
                const bufferedMax = Math.ceil(dataMax / 100) * 100 + 100;
                if (bufferedMax > yAxisMaxRef.current) {
                  yAxisMaxRef.current = bufferedMax;
                }
                return yAxisMaxRef.current;
              }]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }}
              itemStyle={{ color: '#e5e7eb', fontSize: '12px' }}
              labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
              formatter={(value, name) => [parseFloat(value).toFixed(1), name]}
            />
            
            {/* FIX: Dynamic Area Fills */}
            <Area type="monotone" dataKey="Nuclear" stackId="1" stroke="none" fill={colors.nuclear} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Coal" stackId="1" stroke="none" fill={colors.coal} fillOpacity={0.8} />
            <Area type="monotone" dataKey="CCG" stackId="1" stroke="none" fill={colors.ccg} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Wind" stackId="1" stroke="none" fill={colors.wind} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Solar" stackId="1" stroke="none" fill={colors.solar} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Storage" stackId="1" stroke="none" fill={colors.storage} fillOpacity={0.8} />
            <Area type="monotone" dataKey="Gas" stackId="1" stroke="none" fill={colors.gas} fillOpacity={0.8} />
            
            {previewAction && previewAction.action === 'build' && previewAction.type !== 'gas' && previewAction.type !== 'storage' && (
               <Area 
                 type="monotone" 
                 dataKey="Preview" 
                 stackId="1" 
                 stroke="#fff" 
                 strokeDasharray="5 5"
                 strokeWidth={2}
                 fill="#ffffff" 
                 fillOpacity={0.3} 
                 isAnimationActive={false}
               />
            )}

            {/* FIX: Dynamic Demand Line Stroke */}
            <Line type="monotone" dataKey="Demand" stroke={colors.demand} strokeWidth={3} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}