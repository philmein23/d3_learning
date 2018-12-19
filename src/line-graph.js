import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import maunaCsv from "./mauna_loa_co2_monthly_averages.csv";

let width = 600;
let height = 400;

function rowConverter(d) {
  return {
    date: new Date(+d.year, +d.month - 1),
    average: parseFloat(d.average)
  };
}

export default function LineGraph() {
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  useEffect(() => {
    createLineGraph();
  });

  function createLineGraph() {
    d3.csv("mauna_loa_co2_monthly_averages.csv").then(d => {
      console.log("d", d);
      // let dataset = d.map(rowConverter);
      // console.table(dataset, ["table", "average"]);
    });
  }

  return <div>Hello World</div>;
}
