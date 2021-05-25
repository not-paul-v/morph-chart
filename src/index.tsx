import * as React from 'react'
// import styles from './styles.module.css'
import { calcData } from './lib/model';
import { graphData } from "./testGraphData";

export const Chart = () => {
  const pathData = calcData(graphData, 0, 500, 400);
  const currentPathString = pathData.path;

  console.log(currentPathString);

  return(
    <div></div>
  );
}