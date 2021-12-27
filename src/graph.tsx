import React, { useEffect, useRef, useState } from "react";
import ChartModel from "./lib/model";
import { Header } from "./modules/header";
import { LabelButtons } from "./modules/labelButtons";
import styles from "./styles.module.css";
import { ChartCursor, DynamicHeaderData } from "./types/types";

interface ChartProps {
    chartModel: ChartModel;
    children?: (headerData: DynamicHeaderData) => React.ReactNode;
}

const HEADER_HEIGHT = 100;

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value + 1);
}

export const Graph: React.FC<ChartProps> = ({ chartModel, children }) => {
    const [chartCursor, setChartCursor] = useState({
        x: 0,
        y: 0,
        show: false
    } as ChartCursor);
    const [headerData, setHeaderData] = useState({
        dataPointValue: null,
        percentChange: null,
        label: null
    } as DynamicHeaderData);
    const graphRef = useRef(null);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        if (headerData.dataPointValue === null) {
            setHeaderData({
                title: chartModel.data.title,
                dataPointValue: chartModel.getLatestDataPoint().value,
                percentChange: chartModel.getPercentChangeFromIndex(
                    chartModel.getDataPointsLength() - 1
                ),
                label: chartModel.getLatestDataPoint().label
            });
        }
    });

    const handleChartChangeClick = (state: number) => {
        chartModel.changeState(state, true, graphRef);
        forceUpdate();
    };

    const handleMouseLeave = () => {
        changeHeaderData(chartModel.getDataPointsLength());
        setChartCursor({
            x: 0,
            y: 0,
            show: false
        });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (chartModel.morphing || !chartModel.data.cursor?.display) return;

        const maxDataPoints = chartModel.getMaxDataPoints();
        const { dataPointsIndex, xValue, yValue } = chartModel.getXYValues(
            event.nativeEvent.offsetX,
            maxDataPoints
        );

        changeHeaderData(dataPointsIndex);
        setChartCursor({
            x: xValue,
            y: yValue,
            show: yValue !== -1
        });
    };

    const changeHeaderData = (index: number) => {
        if (index < chartModel.getDataPointsLength() && index >= 0) {
            let dpValue = headerData.dataPointValue;
            let pcValue = headerData.percentChange;
            let dpLabel = headerData.label;

            const headerConfig = chartModel.data.header!;

            if (headerConfig.currentValue.update) {
                dpValue = chartModel.getDataPointByIndex(index).value;
            }
            if (headerConfig.percentageChange.update) {
                pcValue = chartModel.getPercentChangeFromIndex(index);
            }
            if (headerConfig.labels.update) {
                dpLabel = chartModel.getDataPointByIndex(index).label;
            }

            setHeaderData((data) => ({
                title: data.title,
                dataPointValue: dpValue,
                percentChange: pcValue,
                label: dpLabel
            }));
        }
    };

    const headerConfig = chartModel.data.header!;
    const chartLabels = chartModel.data.chartLabels;

    return (
        <div
            className={styles.chartContainer}
            style={{ width: chartModel.width }}
        >
            <div style={{ maxHeight: HEADER_HEIGHT }} className="header">
                {children === undefined ? (
                    <Header
                        headerData={headerData}
                        headerConfig={headerConfig}
                    />
                ) : (
                    children(headerData)
                )}
            </div>
            <svg
                width={chartModel.width}
                height={chartModel.height}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={styles.graph}
            >
                <path
                    d={
                        chartModel.pathData.path !== null
                            ? chartModel.pathData.path
                            : ""
                    }
                    style={{
                        fill: "transparent",
                        stroke: chartModel.data.graphColor,
                        strokeWidth: 3
                    }}
                    ref={graphRef}
                />
                <circle
                    cx={chartCursor.x}
                    cy={chartCursor.y}
                    r={chartCursor.show ? 6 : 0}
                    stroke="white"
                    strokeWidth={2}
                    fill={chartModel.data.cursor?.cursorColor || ""}
                />
                <line
                    strokeWidth={chartCursor.show ? 1.5 : 0}
                    x1={chartCursor.x}
                    y1={chartModel.height}
                    x2={chartCursor.x}
                    y2={chartCursor.y}
                    stroke={chartModel.data.cursor?.lineColor || ""}
                    opacity={0.7}
                />
            </svg>
            <LabelButtons
                chartLabels={chartLabels}
                chartModel={chartModel}
                handleChartChangeClick={handleChartChangeClick}
            />
        </div>
    );
};
