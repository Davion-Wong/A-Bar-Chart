import React, {useEffect, useRef} from "react";
import * as d3 from 'd3';

const BarChart = () => {
  const ref = useRef();

  useEffect(() => {
    const data = [1612017, 1638721, 1533583, 1637036, 1824957, 1914394, 1894010, 1704611, 1621720, 1653384, 
                  1533577, 1491748, 1302214, 1143727, 874264, 566069, 334299, 161732, 46780, 6178];
    const labels = ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", 
                    "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-84", "85-89", "90-94", "95-99"];
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(labels)
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(labels[i]))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d))
      .attr("fill", "steelblue")
      .attr("data-date", (d, i) => labels[i])
      .attr("data-gdp", d => d)
      .on("mouseover", function(event, d, i) {
        const textContent1 = `Age group: ${d3.select(event.currentTarget).attr("data-date")}`;
        const textContent2 = `Pupulation: ${d3.select(event.currentTarget).attr("data-gdp")}`;
        const tooltipText1 = tooltip
                              .append("text")
                              .style("text-anchor", "start")
                              .style("font-size", "15px")
                              .style("font-weight", "bold")
                              .style("fill", "steelblue")
                              .text(textContent1)
                              .attr("dy", "1em")
                              .attr("transform", "translate(10,0)");
        const tooltipText2 = tooltip
                              .append("text")
                              .style("text-anchor", "start")
                              .style("font-size", "15px")
                              .style("font-weight", "bold")
                              .style("fill", "steelblue")
                              .text(textContent2)
                              .attr("dy", "2em")
                              .attr("transform", "translate(10,0)");

        const textSize1 = tooltipText1.node().getBBox();
        const textSize2 = tooltipText2.node().getBBox();
        const maxTextWidth = Math.max(textSize1.width, textSize2.width);
        tooltipRect.attr("width", maxTextWidth + 20)
                   .attr("height", 40);

        tooltip
          .style("opacity", 1)
          .attr("data-date", d3.select(event.currentTarget).attr("data-date"))
          .attr("transform", `translate(${event.clientX - 400}, ${event.clientY - 180})`);
        d3.select(event.currentTarget)
          .attr("fill", "orange");
      })
      .on("mouseout", function(event, d) {
        tooltip.style("opacity", 0);
        tooltip.selectAll("text").remove();
        tooltipRect.attr("width", 0)
                   .attr("height", 0);
        d3.select(event.currentTarget)
          .attr("fill", "steelblue");
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
                    .ticks(7)
                    .tickFormat(d3.format(".2s"));

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("id", "x-axis")
      .call(xAxis)
      .selectAll("text")
      .attr("class", "tick");

    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .attr("class", "tick");

    const tooltip = svg
                    .append("g")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
                    .style("pointer-events", "none");

    const tooltipRect = tooltip
                        .append("rect")
                        .attr("width", 200)
                        .attr("height", 250)
                        .style("fill", "yellow")
                        .style("pointer-events", "none");
  }, []);
  return (
    <div>
      <h1 id="title">A bar chart data visualisation</h1>
      <h3 id="subtitle">The Australia populations by age group in 2022</h3>
      <svg ref={ref} />
    </div>
  )
}

export default BarChart;