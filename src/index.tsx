import React from 'react';
import ChartModel from './lib/model';
import Chart from './chart';
import { ChartData } from './types/types';
import { ConvertedData } from './testGraphData';

type ChartProps = {
    width: number;
    height: number;
    data: ChartData;
};

const ChartWrapper = ({ width, height, data }: ChartProps) => {
  console.log(width, height, data);

  const chartModel = new ChartModel(ConvertedData, width, height, 0);

  return (
    <Chart chartModel={chartModel} />
  );
}

export default ChartWrapper;