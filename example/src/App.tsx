import React from 'react'

import { Chart } from 'lean-chart'
import 'lean-chart/dist/index.css'

const App = () => {
  return <Chart width={800} height={400} chartTypes={[0, 1, 2, 3]} />
}

export default App
