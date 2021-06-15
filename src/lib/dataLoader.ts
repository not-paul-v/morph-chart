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
    };
    currentValueDisplayPrefix: string;
    partialGraph: boolean;

    /**
     *
     */
    constructor({
        chartLabels,
        chartData,
        title = null,
        header = defaultHeader,
        cursor = { display: true },
        currentValueDisplayPrefix = "",
        partialGraph = false
    }: ChartData) {
        this.throwErrorOnInvalidParameters({
            chartLabels,
            chartData,
            title,
            header,
            cursor,
            currentValueDisplayPrefix,
            partialGraph
        });

        this.chartLabels = chartLabels;
        this.chartData = chartData;
        this.title = title;
        this.header = header;
        this.cursor = cursor;
        this.currentValueDisplayPrefix = currentValueDisplayPrefix;
        this.partialGraph = partialGraph;
    }

    throwErrorOnInvalidParameters = (data: ChartData): void => {
        data.chartData.forEach((data) => {
            data.points.forEach((point) => {
                if (typeof point.value !== "number") {
                    throw new Error("Invalid value type for datapoint" + point);
                }
            });
        });

        if (data.chartLabels) {
            if (data.chartLabels.length !== data.chartData.length) {
                throw new Error(
                    `Length of chart labels not matching length of data. Expected ${data.chartData.length} labels only got ${data.chartLabels.length}.`
                );
            }
        }

        const header = data.header;
        if (header!.currentValue.update && !header!.currentValue.display) {
            throw new Error(
                "updateCurrentValue cannot be true if displayCurrentValue is false or undefined."
            );
        }

        if (
            header!.percentageChange.update &&
            !header!.percentageChange.display
        ) {
            throw new Error(
                "updatePercentageChange cannot be true if displayPercentageChange is false or undefined."
            );
        }
    };
}
