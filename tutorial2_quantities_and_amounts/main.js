console.log('1')

d3.csv("../data/squirrelActivities.csv", d3.autoType).then(data => { 
    console.log(data)
    console.log('2')


    const width = window.innerWidth * 0.9,
    height = window.innerHeight /2,
    paddingInner = 0.1,
    margin = { top: 20, bottom: 40, left: 40, right: 40 };

  /** SCALES */
  // reference for d3.scales: https://github.com/d3/d3-scale
  const xScaleold = d3
    .scaleBand()
    .domain(data.map(d => d.activity))
    .range([margin.left, width - margin.right])
    .paddingInner(paddingInner);

  const yScaleold = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([height - margin.bottom, margin.top]);

    const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([margin.left, width - margin.right])
    ;

   yScale = d3
    .scaleBand()
    .domain(data.map(d => d.activity))
    .range([margin.top, height - margin.bottom])
    .paddingInner(paddingInner);

  // reference for d3.axis: https://github.com/d3/d3-axis
  const xAxis = d3.axisBottom(xScale).ticks(data.length);
  const yAxis = d3.axisLeft(yScale)

  /** MAIN CODE */
  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("padding-top", "96px")
    .style("border", "1px solid");

  // append rects
  const rect = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("y", d => yScale(d.activity))
    .attr("x", 0) ///d => xScale(d.count))
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "aliceblue")

  // append text
  const text = svg
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("class", "label")
    // this allows us to position the text in the center of the bar
    .attr("x", d => xScale(d.count))
    .attr("y", d => yScale(d.activity)+ (yScale.bandwidth() / 2))
    .text(d => d.count)
    .attr("dy", "1.25em");

    // .attr("x", d => xScale(d.activity) + (xScale.bandwidth() / 2))
    // .attr("y", d => yScale(d.count))
    // .text(d => d.count)
    // .attr("dy", "1.25em");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);
 
    svg
    .append("g")
    .attr("class", "axis")
    // .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(yAxis);
});

console.log('3')

