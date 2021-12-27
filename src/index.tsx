import React from "react";
import ChartModel from "./lib/model";
import { Graph } from "./graph";
import { ChartData, DynamicHeaderData } from "./types/types";

type ChartProps = {
    width: number;
    height: number;
    data: ChartData;
    children?: (headerData: DynamicHeaderData) => React.ReactNode;
};

const Chart = ({ width, height, data, children }: ChartProps) => {
    const chartModel = new ChartModel(data, width, height, 0);

    return <Graph chartModel={chartModel} children={children} />;
};

export default Chart;
