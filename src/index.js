import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import "./styles.css";

var dataset = [
  { key: 0, value: 5 }, //dataset is now an array of objects.
  { key: 1, value: 10 }, //Each object has a 'key' and a 'value'.
  { key: 2, value: 13 },
  { key: 3, value: 19 },
  { key: 4, value: 21 },
  { key: 5, value: 25 },
  { key: 6, value: 22 },
  { key: 7, value: 18 },
  { key: 8, value: 15 },
  { key: 9, value: 13 },
  { key: 10, value: 11 },
  { key: 11, value: 12 },
  { key: 12, value: 15 },
  { key: 13, value: 20 },
  { key: 14, value: 18 },
  { key: 15, value: 17 },
  { key: 16, value: 16 },
  { key: 17, value: 18 },
  { key: 18, value: 23 },
  { key: 19, value: 25 }
];
let width = 600;
let height = 400;

let key = d => d.key;

let xScale = d3
  .scaleBand()
  .domain(d3.range(dataset.length))
  .rangeRound([0, width])
  .paddingInner(0.05);

let yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, d => d.value)])
  .range([0, height]);

function getPositionX(d, i) {
  return xScale(i);
}

function getYCoordinate(d) {
  return height - yScale(d.value);
}

function setBarWidth() {
  return xScale.bandwidth();
}

function setBarHeight(d) {
  return yScale(d.value);
}

function fillBarColor(d, i) {
  return `rgb(${d.value * 10}, 0, 0)`;
}

function App() {
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  useEffect(() => {
    createBarGraph(dataset);
    addDataLabels(dataset);
    addUpdateListener();
    addDataListener();
    removeDataListener();
  });

  function createBarGraph(data) {
    let newBars = svg.selectAll("rect").data(data, key);
    console.log(newBars);
    newBars
      .enter()
      .append("rect")
      .on("mouseover", (d, i, nodes) => {
        let currentElement = d3.select(nodes[i]);
        currentElement.attr("fill", d => {
          return `rgb(${d.value * 10}, 0, ${d.value * 25})`;
        });
      })
      .on("mouseout", (d, i, nodes) => {
        let currentElement = d3.select(nodes[i]);
        currentElement.attr("fill", fillBarColor);
      })
      .attr("x", getPositionX)
      .attr("y", getYCoordinate)
      .attr("width", setBarWidth)
      .attr("height", setBarHeight)
      .attr("fill", fillBarColor);
  }

  function addDataLabels(data) {
    svg
      .selectAll("text")
      .data(data, key)
      .enter()
      .append("text")
      .text(d => {
        return d.value;
      })
      .attr("x", (d, i) => {
        return xScale(i) + xScale.bandwidth() / 2;
      })
      .attr("y", d => {
        return height - yScale(d.value) + 14;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white");
  }

  function addUpdateListener() {
    d3.select("button.update").on("click", () => {
      console.log("data update");
      let maxDataLength = dataset.length;
      let maxValue = 100;

      let randomDataset = [];

      for (let i = 0; i < maxDataLength; i++) {
        let randomNum = Math.floor(Math.random(i) * maxValue);
        randomDataset.push({ key: randomDataset.length, value: randomNum });
      }

      yScale.domain([0, d3.max(randomDataset, d => d.value)]);
      svg
        .selectAll("rect")
        .data(randomDataset, key)
        .transition()
        .duration(1000)
        .attr("y", getYCoordinate)
        .attr("height", setBarHeight)
        .attr("fill", fillBarColor)
        .transition()
        .delay((d, i) => {
          return (i / randomDataset.length) * 1000;
        })
        .duration(1000)
        .attr("fill", (d, i) => {
          return `rgb(0, ${d.value * 10}, 0)`;
        });

      svg
        .selectAll("text")
        .data(randomDataset, key)
        .transition()
        .duration(1000)
        .text(d => {
          return d.value;
        })
        .attr("x", (d, i) => {
          return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", d => {
          return height - yScale(d.value) + 14;
        });
    });
  }

  function addDataListener() {
    d3.select("button.add").on("click", () => {
      let maxValue = 100;
      let newValue = Math.floor(Math.random() * maxValue);

      dataset.push({ key: dataset.length, value: newValue });

      /** update x/y-scales with updated dataset*/
      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, d => d.value)]);

      /** Select */
      let bars = svg.selectAll("rect").data(dataset, key);

      bars
        .enter()
        .append("rect")
        .attr("x", width)
        .attr("y", getYCoordinate)
        .attr("width", setBarWidth)
        .attr("height", setBarHeight)
        .attr("fill", fillBarColor)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", getPositionX)
        .attr("y", getYCoordinate)
        .attr("width", setBarWidth)
        .attr("height", setBarHeight);

      console.log("bars", bars);

      let texts = svg.selectAll("text").data(dataset, key);

      texts
        .enter()
        .append("text")
        .text(d => {
          return d.value;
        })
        .attr("x", width)
        .attr("y", d => {
          return height - yScale(d.value) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .merge(texts)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => {
          return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", d => {
          return height - yScale(d.value) + 14;
        });
    });
  }

  function removeDataListener() {
    d3.select("button.remove").on("click", () => {
      dataset.shift();

      /** update x/y-scales with updated dataset*/
      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, d => d.value)]);

      /** Select */
      let bars = svg.selectAll("rect").data(dataset, key);

      bars
        .enter()
        .append("rect")
        .attr("x", width)
        .attr("y", getYCoordinate)
        .attr("width", setBarWidth)
        .attr("height", setBarHeight)
        .attr("fill", fillBarColor)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", getPositionX)
        .attr("y", getYCoordinate)
        .attr("width", setBarWidth)
        .attr("height", setBarHeight)
        .attr("fill", fillBarColor);

      console.log("bars", bars);

      bars
        .exit()
        .transition()
        .duration(1000)
        .attr("x", -xScale.bandwidth())
        .remove();

      let texts = svg.selectAll("text").data(dataset);

      texts
        .enter()
        .append("text")
        .text(d => {
          return d;
        })
        .attr("x", width)
        .attr("y", d => {
          return height - yScale(d) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .merge(texts)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => {
          return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", d => {
          return height - yScale(d.value) + 14;
        });

      texts
        .exit()
        .transition()
        .duration(1000)
        .attr("x", -xScale.bandwidth())
        .remove();
    });
  }

  return (
    <div>
      <button className="update">Update</button>
      <button className="add">Add Data</button>
      <button className="remove">Remove Data</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
