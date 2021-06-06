export type DataPoint = {
    value: number;
    label: string | null;
};

export type DataPoints = {
    maxDataPoints?: number;
    points: DataPoint[];
};

export type ChartData = {
    chartLabels: string[] | null;
    // chart data length has to match chartTypes length if > 1
    chartData: DataPoints[];
    // e.g. ticker
    title?: string | null;
    // if true display value of current mouse position
    // if false displays last value
    displayCurrentValue?: boolean;
    updateCurrentValue?: boolean;
    displayPercentageChange?: boolean;
    updatePercentageChange?: boolean;
    displayPointLabels?: boolean;
    updateDisplayPointLabels?: boolean;
    // text to add after current value
    currentValueDisplayPrefix?: string;
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
    label: string | null;
};
