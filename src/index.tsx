import React from 'react';
import styles from "./styles.module.css";
import { calcData } from './lib/model';
import { graphData } from "./testGraphData";
import { ChartProps } from './types/types';

export const Chart = ({ width, height, data }: ChartProps) => {
  const pathData = calcData(graphData, 0, width, height);
  const currentPathString = pathData.path;

  return(
    <div className={styles.chartContainer} style={{ width, height }}>
      <svg width={width} height={height}>
        <path d={pathData !== null ? currentPathString : ""} style={{ fill: "transparent", stroke: "blue", strokeWidth: 4 }} />
      </svg>
      { data.chartLabels === null ? null :
        <div className={styles.buttonContainer}>
          {data.chartLabels.map((value, index) => (
            <button className={styles.chartButton} key={index}>{value}</button>
          ))}
        </div>
      }
    </div>
  );
}