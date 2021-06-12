import React, { useEffect, useRef, useState } from 'react';
import ChartModel from './lib/model';
import styles from "./styles.module.css";
import { ConvertedData } from './testGraphData';
import { ChartCursor, DynamicHeaderData } from './types/types';

interface ChartProps {
    chartModel: ChartModel
}

const HEADER_HEIGHT = 100;

function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value + 1);
}

const Chart: React.FC<ChartProps> = ({ chartModel }) => {
    const [chartCursor, setChartCursor] = useState({ x: 0, y: 0, show: false } as ChartCursor);
    const [headerData, setHeaderData] = useState({ dataPointValue: null, percentChange: null, label: null } as DynamicHeaderData);
    const graphRef = useRef(null);
    const forceUpdate = useForceUpdate();

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
        if (chartModel.morphing || !chartModel.data.cursor?.display)
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

    const changeHeaderData = (index: number) => {
        if (index < chartModel.getDataPointsLength()) {
            let dpValue = headerData.dataPointValue;
            let pcValue = headerData.percentChange;
            let dpLabel = headerData.label;

            const headerConfig = chartModel.data.header;

            if (headerConfig.currentValue.update) {
                dpValue = chartModel.getDataPointByIndex(index).value;
            }
            if (headerConfig.percentageChange.update) {
                pcValue = chartModel.getPercentChangeFromIndex(index);
            }
            if (headerConfig.labels.update) {
                dpLabel = chartModel.getDataPointByIndex(index).label;
            }

            setHeaderData({
                dataPointValue: dpValue,
                percentChange: pcValue,
                label: dpLabel,
            });
        }
    }

    const headerConfig = chartModel.data.header;

    return(
        <div className={styles.chartContainer} style={{ width: chartModel.width }}>
            <div style={{maxHeight: HEADER_HEIGHT}} className="header">
                <h1 className={styles.title}>{chartModel.data.title}</h1>
                {!headerConfig.currentValue.display ? null : 
                    <h1 className={styles.dpValue}>{headerData.dataPointValue}</h1>
                }
                {!headerConfig.percentageChange.display && !headerConfig.labels.display ? null : 
                    <div>
                        <p className={styles.percentChange}>
                            {headerConfig.percentageChange.display ? `${headerData.percentChange}%` : null}
                        </p>
                        <p className={styles.label}>
                            {headerConfig.labels.display ? headerData.label : null}
                        </p>
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
                    style={{ fill: "transparent", stroke: "#E64801", strokeWidth: 3 }}
                    ref={graphRef}
                />
                <circle 
                    cx={chartCursor.x} cy={chartCursor.y} 
                    r={chartCursor.show ? 6 : 0}
                    stroke="white"
                    strokeWidth={2}
                    fill="black" 
                />
                <line 
                    strokeWidth={chartCursor.show ? 1.5 : 0} 
                    x1={chartCursor.x} y1={chartModel.height} 
                    x2={chartCursor.x} y2={chartCursor.y} 
                    stroke="black"
                    opacity={0.7}
                />
            </svg>
            { ConvertedData.chartLabels === null ? null :
                <div className={styles.buttonContainer}>
                {ConvertedData.chartLabels.map((value, index) => (
                    <button
                    className={index===chartModel?.state ? styles.selectedButton : ""}
                    key={index}
                    onClick={() => handleChartChangeClick(index)}
                    >
                        {value}
                    </button>
                ))}
                </div>
            }
        </div>
    );
}

export default Chart;