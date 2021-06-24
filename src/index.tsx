import React from 'react';
import ChartModel from './lib/model';
import { Graph } from './graph';
import { ChartData } from './types/types';

type ChartProps = {
    width: number;
    height: number;
    data: ChartData;
};

const Chart = ({ width, height, data }: ChartProps) => {
  const chartModel = new ChartModel(data, width, height, 0);

  return (
    <Graph chartModel={chartModel} />
  );
}

export default Chart;