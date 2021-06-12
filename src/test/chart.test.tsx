import React from 'react';
import ChartWrapper from '..'
import { render, screen } from '@testing-library/react';
import {ConvertedData} from "../testGraphData";

describe('ChartWrapper', () => {
  const size = { width: 400, height: 200}

  // let graphContainer: any;
  
  beforeEach(() => {
    // const { container } = render(
    //   <ChartWrapper width={size.width} height={size.height} data={ConvertedData} />
    // );
    // graphContainer = container;
    // render(
    //   <ChartWrapper width={size.width} height={size.height} data={ConvertedData} />
    // );
  });

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

    // expect(headerElements.length).toBe(1);
    expect(title.textContent).toBe("title");
    expect(percentChange.textContent).toBe("-0.11%");
    expect(label.textContent).toBe("13:59");
  });
});