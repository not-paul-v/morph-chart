import React from 'react';
import ChartWrapper from '..'
import { render } from '@testing-library/react';
import {ConvertedData} from "../testGraphData";
import { ChartData } from '../types/types';

describe('ChartWrapper', () => {
  const size = { width: 400, height: 200}

  it("should display no header", () => {
    const headerConfig = {
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
    ConvertedData.title = null;
    ConvertedData.header = headerConfig;

    const { container } = render(
      <ChartWrapper width={size.width} height={size.height} data={ConvertedData} />
    );

    const headerElements = container.getElementsByClassName('header');

    expect(headerElements.length).toBe(1);
    expect(headerElements[0].textContent).toBe("");
  });

  it("should display title", () => {
    ConvertedData.title = "title";

    const { container } = render(
      <ChartWrapper width={size.width} height={size.height} data={ConvertedData} />
    );

    const headerElements = container.getElementsByClassName('title');

    expect(headerElements.length).toBe(1);
    expect(headerElements[0].textContent).toBe("title");
  });

  it("should dispaly datapoint value, percentchange and label in header", () => {
    const headerConfig = {
      currentValue: {
        display: true
      },
      percentageChange: {
        display: true
      },
      labels: {
        display: true
      }
    }
    ConvertedData.title = "title";
    ConvertedData.header = headerConfig;

    const { container } = render(
      <ChartWrapper width={size.width} height={size.height} data={ConvertedData} />
    );

    const title = container.getElementsByClassName("title")[0];
    const percentChange = container.getElementsByClassName("percentChange")[0];
    const label = container.getElementsByClassName("label")[0];
    const datapointValue = container.getElementsByClassName("dpValue")[0];
    const datapoints = ConvertedData.chartData[0].points;


    expect(title.textContent).toBe("title");
    expect(percentChange.textContent).toBe("-0.11%");
    expect(label.textContent).toBe(datapoints[datapoints.length - 1].label);
    expect(datapointValue.textContent).toBe(datapoints[datapoints.length - 1].value.toString());
  });

  it("should not display buttons", () => {
    const data: ChartData = {
      chartLabels: [],
      chartData: [{ points: [{ value: 0, label: "" }, { value: 1, label: "" }] }],
      title: null
    };

    const { container } = render(
      <ChartWrapper width={size.width} height={size.height} data={data} />
    );

    const title = container.getElementsByClassName("title")[0];
    const buttons = container.getElementsByClassName("buttonContainer")[0];

    expect(title.textContent).toBe("");
    expect(buttons.clientWidth).toBe(0);
  });

  it("should change path on button click", () => {
    const { container } = render(
      <ChartWrapper width={size.width} height={size.height} data={ConvertedData} />
    );
    
    const buttons = container.getElementsByTagName("button");
    expect(buttons.length).toBe(4);

    const oldPath = container.getElementsByTagName("path")[0].getAttribute("d");
    buttons[1].click();
    const newPath = container.getElementsByTagName("path")[0].getAttribute("d");


    expect(oldPath).not.toBe(newPath);
    expect(newPath).not.toBeNull();
  });
});