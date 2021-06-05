import React, { useEffect, useRef, useState } from 'react';
import ChartModel from './lib/model';
import styles from "./styles.module.css";
import { ConvertedData } from './testGraphData';
import { ChartCursor, DynamicHeaderData } from './types/types';

interface ChartProps {
    chartModel: ChartModel
}

const Chart: React.FC<ChartProps> = ({ chartModel }) => {
    const [chartCursor, setChartCursor] = useState({ x: 0, y: 0, show: false } as ChartCursor);
    const [headerData, setHeaderData] = useState({ dataPointValue: null, percentChange: null } as DynamicHeaderData);
    const graphRef = useRef(null);

    useEffect(() => {
        if (headerData.dataPointValue === null) {
            setHeaderData({
                dataPointValue: chartModel.getLatestDataPoint().value,
                percentChange: chartModel.getPercentChangeFromIndex(chartModel.getDataPointsLength() - 1),
            });
        }
    });

    const handleChartChangeClick = (state: number) => {
        chartModel.changeState(state, true, graphRef);
    }

    const handleMouseLeave = () => {
        changeCurrentDataPointValue(ConvertedData.chartData[chartModel.state].points.length-1);
        setChartCursor({
            x: 0,
            y: 0,
            show: false,
        });
    }

    const handleMouseMove = (event: React.MouseEvent) => {
        if (chartModel.morphing)
            return;

        const maxDataPoints = chartModel.getMaxDataPoints();        
        const { dataPointsIndex, xValue, yValue } = chartModel.getXYValues(event.nativeEvent.offsetX, maxDataPoints);

        changeCurrentDataPointValue(dataPointsIndex);
        setChartCursor({
            x: xValue,
            y: yValue,
            show: yValue !== -1,
        });
    }

    const changeCurrentDataPointValue = (index: number) => {
        if (index < ConvertedData.chartData[chartModel.state].points.length) {
            setHeaderData({
                dataPointValue: chartModel.getDataPointByIndex(index).value,
                percentChange: chartModel.getPercentChangeFromIndex(index)
            });
        }
    }

    return(
        <div className={styles.chartContainer} style={{ width: chartModel.width, height: chartModel.height }}>
            <div className={styles.title}>
                { ConvertedData.title } { headerData.dataPointValue }
            </div>
            { !chartModel.data.displayPercentageChange ? null :
                <div className={styles.percent}>
                    { headerData.percentChange } %
                </div>
            }
            <svg
                width={chartModel.width}
                height={chartModel.height}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <path
                    d={chartModel.pathData.path !== null ? chartModel.pathData.path : ""}
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
                    x1={chartCursor.x} y1={chartModel.height} 
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
                    style={index==chartModel?.state ? {color: "gray", cursor: "not-allowed"} : {}}
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