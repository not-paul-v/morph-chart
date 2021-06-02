import React, { useEffect, useRef, useState } from 'react';
import styles from "./styles.module.css";
import ChartModel from './lib/model';
import { interpolatePath } from "d3-interpolate-path";
import { ChartCursor, ChartData, DynamicHeaderData } from './types/types';
import { ConvertedData } from './testGraphData';
import { mapValues } from './lib/math';
import { getYForX, parse } from './lib/path';
const d3 = require("d3");

type ChartProps = {
    width: number;
    height: number;
    data: ChartData;
};

const Chart = ({ width, height, data }: ChartProps) => {
  const [chartState, setChartState] = useState(0);
  const [chartCursor, setChartCursor] = useState({ x: 0, y: 0, show: false } as ChartCursor);
  const [headerData, setHeaderData] = useState({ dataPointValue: null, percentChange: null } as DynamicHeaderData);
  const [morphing, setMorphing] = useState(false);

  const chartModel = new ChartModel(ConvertedData, width, height);
  const pathData = chartModel.calcPath(chartState);
  const path = parse(pathData.path);
  const currentPathString = pathData.path;
  const graphRef = useRef(null);

  useEffect(() => {
    if (headerData.dataPointValue === null) {
      setHeaderData({
        dataPointValue: ConvertedData.chartData[chartState].points[ConvertedData.chartData[chartState].points.length - 1].value,
        percentChange: headerData.percentChange
      })
    }
  })
  console.log(data);

  const handleChartChangeClick = (state: number) => {   
    let previous = currentPathString;
    let current = chartModel.calcPath(state);
    let interpolatedPathData = interpolatePath(previous, current.path);

    morphPath(previous, interpolatedPathData, state, graphRef);
  }

  const handleMouseLeave = () => {
    changeCurrentDataPointValue(ConvertedData.chartData[chartState].points.length-1);
    setChartCursor({
      x: 0,
      y: 0,
      show: false,
    });
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (morphing)
      return;

    let maxDataPoints: number;
    if (ConvertedData.chartData[chartState].maxDataPoints === undefined) {
      maxDataPoints = ConvertedData.chartData[chartState].points.length;
    } else {
      maxDataPoints = ConvertedData.chartData[chartState].maxDataPoints!;
    }
    
    const { dataPointsIndex, xValue, yValue } = getXYValues(event, maxDataPoints);

    changeCurrentDataPointValue(dataPointsIndex);
    setChartCursor({
      x: xValue,
      y: yValue,
      show: yValue !== -1,
    });
  }

  const getXYValues = (event: React.MouseEvent, maxDataPoints: number) => {
    const dataPointsIndex = Math.abs(Math.floor(mapValues(event.nativeEvent.offsetX, [0, width], [0, maxDataPoints])));
    const xValue = mapValues(dataPointsIndex, [0, maxDataPoints-1], [0, width]);
    const yValue = getYOnGraph(xValue);

    return { dataPointsIndex, xValue, yValue };
  }

  const getYOnGraph = (x: number) => {
      try {
          return getYForX(path, x);
      } catch (error) {
          return -1;
      }
  }

  const morphPath = (
    oldPath: string,
    newPath: (t: number) => string,
    newState: number,
    graphRef: React.RefObject<SVGPathElement>
  ) => {
    d3.select(graphRef.current)
      .attr('d', oldPath)
      .transition()
      .duration(1000)
      .attrTween('d', () => newPath)
      .on('start', () => {
        setMorphing(true);
      })
      .on('end', () => {
        setChartState(newState);
        setMorphing(false);
    });
  }

  const changeCurrentDataPointValue = (index: number) => {
    if (index < ConvertedData.chartData[chartState].points.length) {
      setHeaderData({
        dataPointValue: ConvertedData.chartData[chartState].points[index].value,
        percentChange: headerData.percentChange
      })
    }
  }

  return(
    <div className={styles.chartContainer} style={{ width, height }}>
      <div className={styles.title}>{ headerData.dataPointValue }</div>
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
              className={styles.button}
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

export default Chart;