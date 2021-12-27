import React from "react";
import Chart from "lean-chart";
import "lean-chart/dist/index.css";
import { data } from "./graphData";

const App = () => {
    // return <Chart width={700} height={200} data={data} />;
    return (
        <Chart width={700} height={200} data={data}>
            {(headerData) => (
                <div>
                    {headerData.title} - {headerData.dataPointValue}
                </div>
            )}
        </Chart>
    );
};

export default App;
