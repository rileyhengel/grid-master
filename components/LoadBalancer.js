import React from 'react';
import { useGrid } from '../context/GridContext';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InfoTip from './InfoTip'; // <-- NEW: Imported the tooltip component

export default function LoadBalancer() {
  const { fleet, demandMultiplier, weatherModifiers } = useGrid();

  const generateData = () => {
    const data = [];
    
    // Global Storage Setup
    const batteryCapacityMW = fleet?.storage || 0;
    const maxStorageCapacity = batteryCapacityMW * 4; // 4-hour batteries
    let simulatedCharge = 0;

    // --- 1. PRE-ROLL LOOP (Simulate Yesterday) ---
    for (let i = 0; i < 24; i++) {
      let baseDemand = 600; 
      if (i >= 6 && i <= 9) baseDemand += Math.sin((i - 6) * Math.PI / 3) * 150; 
      if (i >= 15 && i <= 21) baseDemand += Math.sin((i - 15) * Math.PI / 6) * 350; 
      let demand = baseDemand * (demandMultiplier || 1.0);
      
      const nuclear = fleet?.nuclear || 0;
      const coal = fleet?.coal || 0;
      const wind = (fleet?.wind || 0) * (0.30 + (0.15 * Math.sin(i * 0.8)) + (0.05 * Math.cos(i * 2))) * weatherModifiers.wind; 
      const solar = i > 7 && i < 18 ? Math.sin((i - 7) * Math.PI / 10) * (fleet?.solar || 0) * weatherModifiers.solar : 0;
      
      let currentSupply = nuclear + coal + wind + solar;
      let net = demand - currentSupply;

      if (net < 0) {
        simulatedCharge = Math.min(maxStorageCapacity, simulatedCharge + Math.abs(net));
      } else if (net > 0) {
        let discharge = Math.min(simulatedCharge, batteryCapacityMW, net);
        simulatedCharge -= discharge;
      }
    }

    // --- 2. REAL CHART LOOP (Today) ---
    // Hand off the baton from yesterday's midnight charge!
    let storedEnergyMWh = simulatedCharge; 
    
    for (let i = 0; i < 24; i++) {
      // Establish the Target Demand Line
      let baseDemand = 600; 
      if (i >= 6 && i <= 9) baseDemand += Math.sin((i - 6) * Math.PI / 3) * 150; 
      if (i >= 15 && i <= 21) baseDemand += Math.sin((i - 15) * Math.PI / 6) * 350; 
      let demand = baseDemand * (demandMultiplier || 1.0);
      
      // Build the Baseload & Renewable Stack
      const nuclear = fleet?.nuclear || 0;
      const coal = fleet?.coal || 0;
      const wind = (fleet?.wind || 0) * (0.30 + (0.15 * Math.sin(i * 0.8)) + (0.05 * Math.cos(i * 2))) * weatherModifiers.wind; 
      const solar = i > 7 && i < 18 ? Math.sin((i - 7) * Math.PI / 10) * (fleet?.solar || 0) * weatherModifiers.solar : 0;
            
      let currentSupply = nuclear + coal + wind + solar;
      let storageDischarge = 0;

      // DYNAMIC STORAGE LOGIC 
      if (currentSupply > demand && batteryCapacityMW > 0) {
        // CHARGE: We have excess baseload/renewable power
        const excessPower = currentSupply - demand;
        const availableRoom = maxStorageCapacity - storedEnergyMWh;
        const chargeAmount = Math.min(excessPower, batteryCapacityMW, availableRoom);
        
        storedEnergyMWh += chargeAmount;
        demand += chargeAmount; // Visual bump in the red demand line 
      } else if (currentSupply < demand && storedEnergyMWh > 0) {
        // DISCHARGE: We have a shortfall and juice in the tank
        const shortfall = demand - currentSupply;
        const maxDischargeMWh = storedEnergyMWh * 0.85; // 85% round-trip efficiency
        
        storageDischarge = Math.min(shortfall, batteryCapacityMW, maxDischargeMWh);
        storedEnergyMWh -= (storageDischarge / 0.85); // Drain the tank
        currentSupply += storageDischarge;
      }

      // DISPATCH GAS (Last resort)
      let gas = 0;
      if (currentSupply < demand) {
        gas = Math.min(fleet?.gas || 0, demand - currentSupply);
      }

      data.push({
        time: `${i}:00`,
        Demand: Math.max(0, demand),
        Nuclear: Math.max(0, nuclear),
        Coal: Math.max(0, coal),
        Wind: Math.max(0, wind),
        Solar: Math.max(0, solar),
        Storage: Math.max(0, storageDischarge),
        Gas: Math.max(0, gas)
      });
    }
    return data;
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0">
      <h2 className="text-green-500 mb-4 uppercase tracking-widest border-b border-green-800 pb-2 flex-shrink-0">
        {/* APPLIED TOOLTIP */}
        <InfoTip termKey="dispatchStack" label="Dispatch Stack (24h)" />
      </h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={generateData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
            <XAxis dataKey="time" stroke="#10b981" />
            <YAxis stroke="#10b981" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }}
              itemStyle={{ color: '#e5e7eb', fontSize: '12px' }}
              labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
              formatter={(value, name) => [parseFloat(value).toFixed(1), name]}
            />
            
            {/* Stacked Supply Areas */}
            <Area type="monotone" dataKey="Nuclear" stackId="1" stroke="none" fill="#7e22ce" fillOpacity={0.8} />
            <Area type="monotone" dataKey="Coal" stackId="1" stroke="none" fill="#4b5563" fillOpacity={0.8} />
            <Area type="monotone" dataKey="Wind" stackId="1" stroke="none" fill="#60a5fa" fillOpacity={0.8} />
            <Area type="monotone" dataKey="Solar" stackId="1" stroke="none" fill="#eab308" fillOpacity={0.8} />
            <Area type="monotone" dataKey="Storage" stackId="1" stroke="none" fill="#22c55e" fillOpacity={0.8} />
            <Area type="monotone" dataKey="Gas" stackId="1" stroke="none" fill="#f97316" fillOpacity={0.8} />
            
            <Line type="monotone" dataKey="Demand" stroke="#ef4444" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}