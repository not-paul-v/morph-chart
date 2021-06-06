import React, { useEffect, useRef, useState } from 'react';
import ChartModel from './lib/model';
import styles from "./styles.module.css";
import { ConvertedData } from './testGraphData';
import { ChartCursor, DynamicHeaderData } from './types/types';

interface ChartProps {
    chartModel: ChartModel
}

const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 60;

function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value + 1);
}

const Chart: React.FC<ChartProps> = ({ chartModel }) => {
    const [chartCursor, setChartCursor] = useState({ x: 0, y: 0, show: false } as ChartCursor);
    const [headerData, setHeaderData] = useState({ dataPointValue: null, percentChange: null, label: null } as DynamicHeaderData);
    const graphRef = useRef(null);
    const forceUpdate = useForceUpdate();
    const totalHeight = chartModel.height + HEADER_HEIGHT + FOOTER_HEIGHT;

    useEffect(() => {
        if (headerData.dataPointValue === null) {
            setHeaderData({
                dataPointValue: chartModel.getLatestDataPoint().value,
                percentChange: chartModel.getPercentChangeFromIndex(chartModel.getDataPointsLength() - 1),
                label: chartModel.getLatestDataPoint().label
            });
        }
    });

    const handleChartChangeClick = (state: number) => {
        chartModel.changeState(state, true, graphRef);
        forceUpdate();
    }

    const handleMouseLeave = () => {
        changeHeaderData(ConvertedData.chartData[chartModel.state].points.length-1);
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

        changeHeaderData(dataPointsIndex);
        setChartCursor({
            x: xValue,
            y: yValue,
            show: yValue !== -1,
        });
    }

    // TODO popup with values

    const changeHeaderData = (index: number) => {
        if (index < chartModel.getDataPointsLength()) {
            let dpValue = headerData.dataPointValue;
            let pcValue = headerData.percentChange;
            let dpLabel = headerData.label;

            if (chartModel.data.updateCurrentValue) {
                dpValue = chartModel.getDataPointByIndex(index).value;
            }
            if (chartModel.data.updatePercentageChange) {
                pcValue = chartModel.getPercentChangeFromIndex(index);
            }
            if (chartModel.data.updateDisplayPointLabels) {
                dpLabel = chartModel.getDataPointByIndex(index).label;
            }

            setHeaderData({
                dataPointValue: dpValue,
                percentChange: pcValue,
                label: dpLabel,
            });
        }
    }

    console.log(chartModel.state);

    return(
        <div className={styles.chartContainer} style={{ width: chartModel.width, height: totalHeight }}>
            <div className={styles.header}>
                <div className={styles.title}>
                    {`${chartModel.data.title} ${chartModel.data.currentValueDisplayPrefix ? chartModel.data.currentValueDisplayPrefix : ""}`}
                    {headerData.dataPointValue}
                </div>
                { !chartModel.data.displayPercentageChange ? null :
                    <div className={styles.percent}>
                        {`${headerData.percentChange} % ${headerData.label}`}
                    </div>
                }
            </div>
            <svg
                width={chartModel.width}
                height={chartModel.height}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={styles.graph}
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
                    className={index===chartModel?.state ? styles.selectedButton : ""}
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