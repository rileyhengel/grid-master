export const DICTIONARY = {
    // 1. The Physics & Mechanics
    dispatchStack: "The daily order in which your power plants turn on, from the cheapest baseload up to the most expensive peakers. Keep your cheap assets running constantly, or you'll be forced to trigger expensive peakers just to meet the red demand line.",
    baseload: "Your grid's heavy lifters that run 24/7. They require massive upfront capital and years to build, but generate massive power at dirt-cheap operating costs.",
    peakers: "High-cost emergency generators that only spin up when city demand spikes. They are fast to build but burn cash so rapidly that relying on them will bankrupt your utility.",
    peakDemand: "The absolute highest point of energy consumption in a given day, typically when citizens return home from work. If your fleet cannot hit this red line, the grid fails and heads roll.",
    lcoe: "The brutal reality of your day-to-day operating expenses, measured in $/MWh. A plant that is suspiciously cheap to build is almost always financially toxic to operate.",
    curtailment: "Throwing away perfectly good power. If your renewables generate more energy than the city needs and you lack batteries, the excess is dumped at a severe financial penalty.",
    voll: "The catastrophic financial and political cost of a blackout. Letting the city go dark destroys your cash flow, tanks your credit rating, and fast-tracks your termination.",
    
    // 2. The Municipal Economics
    retailRate: "The price you charge citizens for keeping their lights on. Jacking up rates pads your budget for new infrastructure, but greedy pricing will utterly destroy your public approval.",
    bond: "Taking on massive city debt to fund your infrastructure pipeline. You get a vital lump sum today, but you'll be chained to crippling interest payments for the next decade.",
    creditRating: "Wall Street's measure of your competence, dictating your borrowing power. Bleed cash or cause blackouts and you'll be downgraded to JUNK, making new debt impossibly expensive.",
    interconnection: "The punishing cost of running out of local real estate. Building wind or solar far outside the city forces you to front millions for high-voltage transmission lines.",
    nimby: "The severe political penalty for building heavily polluting assets inside city limits. Citizens want the power, but if you put a coal or gas plant in their neighborhood, your approval will plummet.",
    
    // 3. The Asset Fleet
    coal: "Cheap to build and cheap to run, but a political nightmare. Relying on this relic pads your margins today but ensures you'll fail your Net Zero mandates tomorrow.",
    gas: "Quick to construct and perfect for hitting evening demand spikes. However, the fuel costs are so violently high that running them constantly will bleed your budget dry.",
    nuclear: "The ultimate baseload heavyweight. It takes a decade and a billion dollars to build, but rewards you with massive, zero-carbon power at near-zero daily operating costs.",
    wind: "Cheap, zero-carbon energy that is entirely at the mercy of the weather. It is fantastic for padding your green metrics, but highly volatile and completely out of your control.",
    solar: "Highly predictable daytime generation that helps you crush afternoon demand. Unfortunately, it goes to zero exactly when the evening peak hits, making it a liability unless paired with storage.",
    battery: "The financial shock absorbers of a modern grid. Buy cheap solar during the day and discharge it during the lucrative evening peak to save your budget from expensive gas peakers.",
  
    // 4. The Environment
    carbonIntensity: "The live tracker of how dirty your grid is right now. It measures your emissions per unit of energy and dictates whether you are on pace for the Year 30 Net Zero mandate.",
    regulatoryFines: "Devastating financial strikes from state regulators. If your carbon intensity stays above the mandated emissions curve, these recurring penalties will quickly drive your utility into insolvency."
  };