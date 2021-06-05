export type DataPoint = {
    value: number;
    label: string | null;
};

export type DataPoints = {
    maxDataPoints: number | undefined;
    points: DataPoint[];
};

export type ChartData = {
    chartLabels: string[] | null;
    // chart data length has to match chartTypes length if > 1
    chartData: DataPoints[];
    // e.g. ticker
    title?: string | null;
    // e.g. currency
    subtitle?: string | null;
    // if true display value of current mouse position
    // if false displays last value
    displayCurrentValue?: boolean;
    displayPercentageChange?: boolean;
    displayPointLabels?: boolean;
    // if true checks for max datapoints prop to display partial graph otherwise stretches graph to full width
    partialGraph?: boolean;
};

export type ChartCursor = {
    x: number;
    y: number;
    show: boolean;
};

export type DynamicHeaderData = {
    dataPointValue: number | null;
    percentChange: number | null;
};
