import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { ChartData, DataPoint } from "../types/types";
import { getYForX, parse, Path } from "./path";
import { interpolatePath } from "d3-interpolate-path";
import { mapValues } from "./math";
import React from "react";

const d3 = require("d3");

export default class ChartModel {
    data: ChartData;
    width: number;
    height: number;
    state: number;
    pathData: any;
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
        this.checkData(_data);
        this.data = _data;
        this.width = _width;
        this.height = _height;
        this.state = _state;
        this.morphing = false;

        // calculate path stuff
        this.pathData = this.calcPath(_state);
        this.parsedPath = parse(this.pathData.path);
    }

    checkData = (data: ChartData) => {
        if (data.chartLabels) {
            if (data.chartLabels.length !== data.chartData.length) {
                throw new Error(
                    `Length of chart labels not matching length of data. Expected ${data.chartData.length} labels.`
                );
            }
        }
    };

    calcPath = (type: number) => {
        const datapoints = this.data.chartData[type];
        // Parse string to float
        const formattedValues = datapoints.points.map(
            (datapoint, index) => [datapoint.value, index] as [number, number]
        );

        //Split formattedValues to prices and dates array
        let prices = formattedValues.map((value) => value[0]);
        let indices = formattedValues.map((value) => value[1]);

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
            .range([this.height, 0]);

        return {
            minPrice,
            maxPrice,
            datapoints: datapoints,
            path: shape
                .line()
                .x(([, x]) => scaleX(x) as number)
                .y(([y]) => scaleY(y) as number)
                .curve(shape.curveBasis)(formattedValues) as string
        };
    };

    changeState = (
        state: number,
        morph: boolean | undefined,
        ref: React.RefObject<SVGPathElement>
    ) => {
        this.state = state;

        if (morph === true) {
            let previous = this.pathData.path;
            let interpolatedPathData = this.getInterpolatedPath(state);

            this.morphPath(previous, interpolatedPathData, state, ref);
        }

        this.pathData = this.calcPath(state);
        this.parsedPath = parse(this.pathData.path);
    };

    morphPath = (
        oldPath: string,
        newPath: (t: number) => string,
        newState: number,
        graphRef: React.RefObject<SVGPathElement>
    ) => {
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

    getInterpolatedPath = (state: number) => {
        let current = this.calcPath(state);
        return interpolatePath(this.pathData.path, current.path);
    };

    getXYValues = (xPosition: number, maxDataPoints: number) => {
        const dataPointsIndex = Math.abs(
            Math.floor(
                mapValues(xPosition, [0, this.width], [0, maxDataPoints])
            )
        );
        const xValue = mapValues(
            dataPointsIndex,
            [0, maxDataPoints - 1],
            [0, this.width]
        );
        const yValue = this.getYOnGraph(xValue);

        return { dataPointsIndex, xValue, yValue };
    };

    getYOnGraph = (x: number) => {
        try {
            return getYForX(this.parsedPath, x);
        } catch (error) {
            return -1;
        }
    };

    getLatestDataPoint = (state: number): DataPoint => {
        const pointsLength = this.data.chartData[state].points.length;
        return this.data.chartData[state].points[pointsLength - 1];
    };

    getDataPointByIndex = (state: number, index: number): DataPoint => {
        return this.data.chartData[state].points[index];
    };
}
