import React from "react";
import Chart from "lean-chart";
import 'lean-chart/dist/index.css';
import { data } from "./graphData";

const App = () => {
  return <Chart width={700} height={200} data={data} />
}

export default App
