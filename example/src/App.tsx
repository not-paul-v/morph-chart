import React from 'react';

import Chart from "lean-chart";
import 'lean-chart/dist/index.css';

const data = {
  chartLabels: ["1D", "5D", "1M", "1Y"],
  //todo type export
  chartData: [{maxDataPoints: 70, dataPoints: [0, "t"]} as any],
  displayCurrentValue: true,
  displayPercentageChange: true,
  displayPointLabels: false,
}

const App = () => {
  return <Chart width={700} height={200} data={data} />
}

export default App
