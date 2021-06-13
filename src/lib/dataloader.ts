import { ChartData, DataPoints, HeaderConfig } from "../types/types";

const defaultHeader = {
    currentValue: {
        display: true,
        update: true,
        prefix: "",
        suffix: ""
    },
    percentageChange: {
        display: true,
        update: true
    },
    labels: {
        display: true,
        update: true
    }
} as HeaderConfig;

export default class DataLoader {
    chartLabels: string[] | null;
    chartData: DataPoints[];
    title: string | null;
    header: any;
    cursor: {
        display: boolean;
    }
    currentValueDisplayPrefix: string;
    partialGraph: boolean;

    /**
     *
     */
    constructor(
        {
            chartLabels,
            chartData,
            title = null,
            header = defaultHeader,
            cursor = { display: true },
            currentValueDisplayPrefix = "",
            partialGraph = false,
        }: ChartData
    ) {
        this.chartLabels = chartLabels;
        this.chartData = chartData;
        this.title = title;
        this.header = header;
        this.cursor = cursor;
        this.currentValueDisplayPrefix = currentValueDisplayPrefix;
        this.partialGraph = partialGraph;
    }
}