import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { DataPoints } from "../types/types";

export const calcPath = (
    datapoints: DataPoints,
    width: number,
    height: number
) => {
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
        .range([0, width * relDataPoints]);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    // scales min_prices-max_price to SIZE-0 (flipped range)
    const scaleY = scaleLinear()
        .domain([minPrice, maxPrice])
        .range([height, 0]);

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
