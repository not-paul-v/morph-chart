import React, { useRef, useState } from 'react';
import styles from "./styles.module.css";
import ChartModel from './lib/model';
import { interpolatePath } from "d3-interpolate-path";
import { ChartCursor, ChartData, MousePoint } from './types/types';
import { ConvertedData } from './testGraphData';
import { mapValues } from './lib/math';
import { getYForX, parse } from './lib/path';
const d3 = require("d3");

type ChartProps = {
    width: number;
    height: number;
    data: ChartData;
};

export const Chart = ({ width, height, data }: ChartProps) => {
  const [chartState, setChartState] = useState(0);
  const [chartCursor, setChartCursor] = useState({ x: 0, y: 0, show: false } as ChartCursor);

  const chartModel = new ChartModel(ConvertedData, width, height);

  console.log(data);


  const pathData = chartModel.calcPath(chartState);
  const path = parse(pathData.path);
  const currentPathString = pathData.path;
  const graphRef = useRef(null);

  const handleChartChangeClick = (state: number) => {
    let previous = currentPathString;
    let current = chartModel.calcPath(state);
    let interpolatedPathData = interpolatePath(previous, current.path);

    d3.select(graphRef.current)
      .attr('d', previous)
      .transition()
      .duration(1000)
      .attrTween('d', () => interpolatedPathData)
      .on('end', () => {
        setChartState(state);
    });
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    let maxDataPoints: number;
    if (ConvertedData.chartData[chartState].maxDataPoints === undefined) {
      maxDataPoints = ConvertedData.chartData[chartState].points.length;
    } else {
      maxDataPoints = ConvertedData.chartData[chartState].maxDataPoints!;
    }
    
    const dataPointsIndex = Math.abs(Math.floor(mapValues(event.nativeEvent.offsetX, [0, width], [0, maxDataPoints])));
    const xValue = mapValues(dataPointsIndex, [0, maxDataPoints-1], [0, width]);
    const yValue = getYOnGraph(xValue);
    
    setChartCursor({
      x: xValue,
      y: yValue,
      show: true,
    });
    console.log(chartCursor);
  }

  const getYOnGraph = (x: number) => {
        try {
            return getYForX(path, x);
        } catch (error) {
            return 0;
        }
    }

  return(
    <div className={styles.chartContainer} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
      >
        <path
          d={pathData !== null ? currentPathString : ""}
          style={{ fill: "transparent", stroke: "blue", strokeWidth: 4 }}
          ref={graphRef}
        />
        <circle 
          cx={chartCursor.x} cy={chartCursor.y} 
          r={chartCursor.show ? 5 : 0} 
          stroke="gray" 
          strokeWidth={20} 
          strokeOpacity={0.40} 
          fill="black" 
        />
        <line 
          strokeWidth={chartCursor.show ? 3 : 0} 
          x1={chartCursor.x} y1={height} 
          x2={chartCursor.x} y2={chartCursor.y} 
          stroke="black"
          strokeDasharray={4} opacity={0.7}
        />
      </svg>
      { ConvertedData.chartLabels === null ? null :
        <div className={styles.buttonContainer}>
          {ConvertedData.chartLabels.map((value, index) => (
            <button
              className={styles.chartButton}
              style={index==chartState ? {color: "gray", cursor: "not-allowed"} : {}}
              key={index}
              onClick={() => handleChartChangeClick(index)}
            >{value}</button>
          ))}
        </div>
      }
    </div>
  );
}