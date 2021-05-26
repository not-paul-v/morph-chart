import React from 'react';
// import styles from './styles.module.css'
import { calcData } from './lib/model';
import { graphData } from "./testGraphData";

type ChartProps = {
  width: number,
  height: number
}

export const Chart = ({ width, height }: ChartProps) => {
  const pathData = calcData(graphData, 0, width, height);
  const currentPathString = pathData.path;

  return(
    <div id="chartContainer">
      <svg width={width} height={height}>
        <path d={ pathData !== null ? currentPathString : "" }/>
      </svg>
    </div>
  );
}