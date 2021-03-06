import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { ChartData, DataPoint, DataPoints } from "../types/types";
import { getYForX, parse, Path } from "./path";
import { interpolatePath } from "d3-interpolate-path";
import { mapValues, relativePercent } from "./math";
import React from "react";
import DataLoader from "./dataLoader";
const d3 = require("d3");

type PathData = {
    minPrice: number;
    maxPrice: number;
    datapoints: DataPoints;
    path: string;
};

export default class ChartModel {
    data: ChartData;
    width: number;
    height: number;
    state: number;
    pathData: PathData;
    parsedPath: Path;
    morphing: boolean;
    /**
     *
     */
    constructor(
        _data: ChartData,
        _width: number,
        _height: number,
        _state: number
    ) {
        this.data = new DataLoader(_data);
        this.width = _width;
        this.height = _height;
        this.state = _state;
        this.morphing = false;

        this.pathData = this.calcPath();
        this.parsedPath = parse(this.pathData.path);
    }

    calcPath = (): PathData => {
        const datapoints = this.data.chartData[this.state];
        // Parse string to float
        const formattedValues = datapoints.points.map(
            (datapoint, index) => [datapoint.value, index] as [number, number]
        );

        // Split formattedValues to prices and dates array
        const prices = formattedValues.map((value) => value[0]);
        const indices = formattedValues.map((value) => value[1]);

        // scales min_date-max_date to 0-SIZE
        // data_points - max_data_points -> 0 - width
        let relDataPoints = 1;
        if (datapoints.maxDataPoints !== undefined) {
            const maxDataPoints = datapoints.maxDataPoints;
            const dataPoints = datapoints.points.length;
            relDataPoints = dataPoints / maxDataPoints;
        }

        const scaleX = scaleLinear()
            .domain([Math.min(...indices), Math.max(...indices)])
            .range([0, this.width * relDataPoints]);

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        // scales min_prices-max_price to SIZE-0 (flipped range)
        const scaleY = scaleLinear()
            .domain([minPrice, maxPrice])
            .range([this.height - 10, 10]);

        return {
            minPrice,
            maxPrice,
            datapoints: datapoints,
            path: shape
                .line()
                .x(([, x]) => scaleX(x) as number)
                .y(([y]) => scaleY(y) as number)
                .curve(shape.curveCatmullRom.alpha(0.2))(
                formattedValues
            ) as string
        };
    };

    changeState = (
        state: number,
        morph: boolean | undefined,
        ref: React.RefObject<SVGPathElement>
    ): void => {
        this.state = state;

        if (morph === true) {
            const previous = this.pathData.path;
            const interpolatedPathData = this.getInterpolatedPath();

            this.morphPath(previous, interpolatedPathData, state, ref);
        }

        this.pathData = this.calcPath();
        this.parsedPath = parse(this.pathData.path);
    };

    morphPath = (
        oldPath: string,
        newPath: (t: number) => string,
        newState: number,
        graphRef: React.RefObject<SVGPathElement>
    ): void => {
        d3.select(graphRef.current)
            .attr("d", oldPath)
            .transition()
            .duration(1000)
            .attrTween("d", () => newPath)
            .on("start", () => {
                this.morphing = true;
            })
            .on("end", () => {
                this.state = newState;
                this.morphing = false;
            });
    };

    getInterpolatedPath = (): ((t: number) => string) => {
        const current = this.calcPath();
        return interpolatePath(this.pathData.path, current.path);
    };

    getXYValues = (
        xPosition: number,
        maxDataPoints: number
    ): {
        dataPointsIndex: number;
        xValue: number;
        yValue: number;
    } => {
        const dataPointsIndex = Math.abs(
            Math.round(
                mapValues(xPosition, [0, this.width], [0, maxDataPoints - 1])
            )
        );

        if (dataPointsIndex >= this.data.chartData[this.state].points.length) {
            return { dataPointsIndex: -1, xValue: -1, yValue: -1 };
        }

        const xValue = mapValues(
            dataPointsIndex,
            [0, maxDataPoints - 1],
            [0, this.width]
        );

        const yValue =
            this.data.chartData[this.state].points[dataPointsIndex].value;
        const yCord = mapValues(
            yValue,
            [this.pathData.minPrice, this.pathData.maxPrice],
            [this.height - 10, 10]
        );

        return { dataPointsIndex, xValue, yValue: yCord };
    };

    getYOnGraph = (x: number): number => {
        try {
            return getYForX(this.parsedPath, x);
        } catch (error) {
            return -1;
        }
    };

    getMaxDataPoints = (): number => {
        const currentDPs = this.data.chartData[this.state];
        if (currentDPs.maxDataPoints === undefined) {
            return currentDPs.points.length;
        } else {
            return currentDPs.maxDataPoints;
        }
    };

    getPercentChangeFromIndex = (index: number): number => {
        const firstValue = this.getDataPointByIndex(0).value;
        const secondValue = this.getDataPointByIndex(index).value;

        const percentChange = relativePercent(secondValue, firstValue);
        return Math.round(percentChange * 10000) / 100;
    };

    getLatestDataPoint = (): DataPoint => {
        const pointsLength = this.data.chartData[this.state].points.length;
        return this.data.chartData[this.state].points[pointsLength - 1];
    };

    getDataPointByIndex = (index: number): DataPoint => {
        return this.data.chartData[this.state].points[index];
    };

    getDataPointsLength = (): number => {
        return this.data.chartData[this.state].points.length;
    };
}
