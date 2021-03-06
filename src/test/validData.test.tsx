import ChartModel from '../lib/model';
import { ChartData } from '../types/types';

describe("Throw error if data is invalid", () => {
  beforeEach(() => {
  })

  it("throws error if length of labels doesn't match length of data arrays", () => {
    const chartData: ChartData = {
      chartData: [{ points: [{ value: 0, label: "" }] }, { points: [{ value: 0, label: "" }] }],
      chartLabels: ["test"],
      header: {
        currentValue: {
          display: false
        },
        percentageChange: {
          display: false
        },
        labels: {
          display: false
        }
      }
    }

    const t = () => {
      new ChartModel(chartData, 400, 400, 0);
    }

    expect(t).toThrow("Length of chart labels not matching length of data. Expected 2 labels only got 1.");
  });

  it("throws error if length of labels doesn't match length of data arrays", () => {
    const chartData: ChartData = {
      chartData: [{ points: [{ value: 0, label: "" }] }, { points: [{ value: 0, label: "" }] }],
      chartLabels: ["", ""],
      header: {
        currentValue: {
          display: false,
          update: true
        },
        percentageChange: {
          display: false
        },
        labels: {
          display: false
        }
      }
    }
    
    const t = () => {
      new ChartModel(chartData, 400, 400, 0);
    }

    expect(t).toThrow("updateCurrentValue cannot be true if displayCurrentValue is false or undefined.");
  });

  it("throws error if length of labels doesn't match length of data arrays", () => {
    const chartData: ChartData = {
      chartData: [{ points: [{ value: 0, label: "" }] }, { points: [{ value: 0, label: "" }] }],
      chartLabels: ["", ""],
      header: {
        currentValue: {
          display: true
        },
        percentageChange: {
          display: false,
          update: true
        },
        labels: {
          display: false
        }
      }
    }
    
    const t = () => {
      new ChartModel(chartData, 400, 400, 0);
    }

    expect(t).toThrow("updatePercentageChange cannot be true if displayPercentageChange is false or undefined.");
  });

  it("calculates path data as planned if input data is valid", () => {
    const chartData: ChartData = {
      chartData: [{ points: [{ value: 0, label: "" }, { value: 1, label: "" }] }, { points: [{ value: 1, label: "" }, { value: 0, label: "" }] }],
      chartLabels: ["first test", "second test"],
      header: {
        currentValue: {
          display: false
        },
        percentageChange: {
          display: false
        },
        labels: {
          display: false
        }
      }
    }

    let chartModel = new ChartModel(chartData, 400, 400, 0);
    expect(chartModel.pathData.path).not.toBe("");
  })
});
