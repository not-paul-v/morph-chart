import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";

interface Amount {
    amount: string;
    currency: string;
}

interface PercentChange {
    hour: number;
    day: number;
    week: number;
    month: number;
    year: number;
    all: number;
}

interface LatestPrice {
    amount: Amount;
    timestamp: string;
    percent_change: PercentChange;
}

type PriceList = [string, number][];

interface DataPoints {
    max_data_points: number;
    data_points: number;
    percent_change: number;
    prices: PriceList;
}

interface Prices {
    latest: string;
    latest_price: LatestPrice;
    hour: DataPoints;
    day: DataPoints;
    week: DataPoints;
    month: DataPoints;
    year: DataPoints;
    all: DataPoints;
}

// const values = data.data.prices as Prices;
// const POINTS = 60;

export const calcData = (
    data: any,
    type: number,
    width: number,
    height: number
) => {
    let datapoints;
    let label;

    let values = data.data.prices as Prices;
    switch (type) {
        case 0:
            datapoints = values.day;
            label = "Today";
            break;
        case 1:
            datapoints = values.week;
            label = "Last Week";
            break;
        case 2:
            datapoints = values.month;
            label = "Last Month";
            break;
        case 3:
            datapoints = values.year;
            label = "Last Year";
            break;
        default:
            datapoints = values.day;
            label = "Today";
    }

    // const priceList = datapoints.prices.slice(0, POINTS);
    const priceList = datapoints.prices;

    // Parse string to float
    const formattedValues = priceList.map(
        (price, index) => [parseFloat(price[0]), index] as [number, number]
    );

    //Split formattedValues to prices and dates array
    let prices = formattedValues.map((value) => value[0]);
    let dates = formattedValues.map((value) => value[1]);

    // scales min_date-max_date to 0-SIZE
    // data_points - max_data_points -> 0 - width
    let relDataPoints = 1;
    if (type === 0) {
        const maxDataPoints = datapoints.max_data_points;
        const dataPoints = datapoints.data_points;
        relDataPoints = dataPoints / maxDataPoints;
    }

    const scaleX = scaleLinear()
        .domain([Math.min(...dates), Math.max(...dates)])
        .range([0, width * relDataPoints]);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    // scales min_prices-max_price to SIZE-0 (flipped range)
    const scaleY = scaleLinear()
        .domain([minPrice, maxPrice])
        .range([height, 0]);

    return {
        label,
        minPrice,
        maxPrice,
        datapoints: datapoints,
        percentChange: datapoints.percent_change,
        path: shape
            .line()
            .x(([, x]) => scaleX(x) as number)
            .y(([y]) => scaleY(y) as number)
            .curve(shape.curveBasis)(formattedValues) as string
    };
};

export const graphs = [
    {
        label: "1D",
        value: 0,
        name: "Last Day"
    },
    {
        label: "5D",
        value: 1,
        name: "Last Week"
    },
    {
        label: "1M",
        value: 2,
        name: "Last Month"
    },
    {
        label: "1Y",
        value: 3,
        name: "Last Year"
    }
] as const;

export type GraphIndex = 0 | 1 | 2 | 3;
