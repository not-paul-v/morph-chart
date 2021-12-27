# morph-chart

|                                        Mouse Cursor                                         |                                  Morph Transitions                                  |
| :-----------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![](https://github.com/itsPauV/morph-chart/raw/main/src/common/images/chart_screenshot.png) | ![](https://github.com/itsPauV/morph-chart/raw/main/src/common/gif/morph_chart.gif) |

A react chart component with morph transitions.
<br>
Inspired by RobinHood's 'Spark' and Rainbow Charts.

[![NPM](https://img.shields.io/npm/v/morph-chart.svg)](https://www.npmjs.com/package/morph-chart) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save morph-chart
```

## Usage

```tsx
import React from "react";
import Chart from "morph-chart";
import "morph-chart/dist/index.css";
import { data } from "./graphData";

const App = () => {
    return <Chart width={700} height={200} data={data} />;
};

export default App;
```

### Use a custom header

```tsx
const App = () => {
    return (
        <Chart width={700} height={200} data={data}>
            {(headerData) => (
                <div>
                    {headerData.title} - {headerData.dataPointValue}
                </div>
            )}
        </Chart>
    );
};

export default App;
```

## License

MIT © [itsPauV](https://github.com/itsPauV)

# Lean Graph
