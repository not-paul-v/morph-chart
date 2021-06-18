import React from 'react';
import ChartModel from './lib/model';
import Chart from './chart';
import { ChartData } from './types/types';

type ChartProps = {
    width: number;
    height: number;
    data: ChartData;
};

const ChartWrapper = ({ width, height, data }: ChartProps) => {
  const chartModel = new ChartModel(data, width, height, 0);

  return (
    <Chart chartModel={chartModel} />
  );
}

export default ChartWrapper;