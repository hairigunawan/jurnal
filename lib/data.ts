// lib/data.ts
export const metrics = [
  { label: "Trades", value: "2799", sub: "Longs won 80%" },
  { label: "Win rate", value: "77.17%", sub: "Shorts won 76.35%" },
  { label: "Avg. return per trade, $", value: "1.29 USD", sub: "Profit factor 4.05" },
  { label: "Avg. win, $", value: "2.22 USD", sub: "Expectancy 1.29 USD" },
  { label: "Avg. loss, $", value: "-1.86 USD", sub: "AHPR 0.01%" },
  { label: "Best trade, $", value: "15.65 USD", sub: "GHPR 0.1%" },
  { label: "Worst trade, $", value: "-5.74 USD", sub: "" },
  { label: "Avg. units per trade", value: "1227.97", sub: "" },
  { label: "Avg. trade length", value: "5h 55m 15s", sub: "" },
];

export const monthlyData = [
  { name: 'October', profit: 500, equity: 1000 },
  { name: 'November', profit: 4500, equity: 3500 },
];

export const dailyData = [
  { name: 'Monday', profit: 500, equity: 600 },
  { name: 'Tuesday', profit: 1200, equity: 800 },
  { name: 'Wednesday', profit: 1500, equity: 1100 },
  { name: 'Thursday', profit: 800, equity: 900 },
  { name: 'Friday', profit: 500, equity: 400 },
];