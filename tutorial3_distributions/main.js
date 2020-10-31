console.log('1')

//d3.csv("./NYC_Death.csv", d3.autoType).then(data => { 
   // console.log(data)
   // console.log('2')

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedSex: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.csv("NYC_Death.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  const cleandata = raw_data.filter(r => !isNaN( Number.parseFloat( r["Deaths"])))
  console.log("raw_data", raw_data);
  window.data = raw_data;
  state.data = cleandata;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
  const years = data.map(d => d.Year)
  const setOfYears = new Set(years)
  const sortedYears = Array.from(setOfYears).sort()

  
xScale = d3.scaleBand()
  .domain(sortedYears)
  // .domain([...new Set(data.map(d => d.Year))].sort())
  //above code is JS, mapping array, instead of having an "object", now as a year/integer
  //triple dot is the spread operater [...[1,2,3]]
  .range([margin.left, width - margin.right])
  // .paddingInner(.2)
  // .paddingOuter(.2)
  //.align(config.align)
  //.round(config.round)

  console.log('extent: ', d3.extent(state.data, d => d.Deaths))

yScale = d3
  .scaleLinear()
  .domain(d3.extent(state.data, d => d.Deaths))
  .range([height - margin.bottom, margin.top]);

// AXES
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

  
// UI ELEMENT SETUP
// add dropdown (HTML selection) for interaction
// HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
const selectElement = d3.select("#dropdown").on("change", function() {
  console.log("new selected party is", this.value);
  // `this` === the selectElement
  // this.value holds the dropdown value a user just selected
 // state.selectedParty = this.value;
  state.selectedSex = "All"
  if(this.value === "Male") state.selectedSex = "M"
  if(this.value === "Female") state.selectedSex = "F"
  draw(); // re-draw the graph based on this new selection
});

// add in dropdown options from the unique values in the data
selectElement
  .selectAll("option")
  .data(["All", "Male", "Female"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
  .join("option")
  .attr("value", d => d)
  .text(d => d);

// create an svg element in our main `d3-container` element
svg = d3
  .select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
  // + SCALES

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");
// add the yAxis
svg
.append("g")
.attr("class", "axis y-axis")
.attr("transform", `translate(${margin.left},0)`)
.call(yAxis)
.append("text")
.attr("class", "axis-label")
.attr("y", "50%")
.attr("dx", "-3em")
.attr("writing-mode", "vertical-rl")
.text("Deaths");

draw(); // calls the draw function



  // + AXES



  // + CREATE SVG ELEMENT

  // + CALL AXES

 // draw(); // calls the draw function
}

/* DRAW FUNCTION */
 // we call this everytime there is an update to the data/state
 function draw() { 
  let filterdata = state.data
  //let selectedgender = "F"
  
  if(state.selectedSex!=="All")
  {
    filterdata = state.data.filter(d => d.Sex === state.selectedSex)
  }
  // + FILTER DATA BASED ON STATE
  // console.log (state.data)
  // console.log(d3.rollups)
  //const groupdata = d3.rollups(filterdata, v => d3.sum(v,d => d.Deaths), d => d.Year)
  // ^line above is "All" --> make it my default
  //const femaledata = d3.rollu
  //all data (year, number) then same for female and male 
  // console.log ('groupdata: ', groupdata)
  const dot = svg
     .selectAll("circle")
     .data(filterdata, d => `${d.Year}_${d["Leading Cause"]}`)
     // unique identifier 
     .attr("data-label", d => `${d.Year}_${d["Leading Cause"]}`)
     .join(
     enter => enter.append("circle")
     .attr("r", "5px")
     .attr("cy", d => {
      //  if (typeof d.Deaths === 'string') {
      //    console.log("deaths is string: " , d.Deaths)
      //  }
       // console.log('d.Deaths: ', d.Deaths)
        //console.log(`${d.Year}_${d["Leading Cause"]}`)
        //console.log(yScale(d.Deaths))
       return yScale(d.Deaths)

     })
    //  .attr("cx", d => xScale(d.Year))
     .attr("cx", d => margin.left) // initial value - to be transitioned
     .call(enter =>{ 
       console.log('in transition: ', enter)
     
      return  enter
         .transition() // initialize transition
         .delay(d => 500 /** d.Year*/) // delay on each element
         .duration(500) // duration 500ms
         .attr("cx", d => xScale.bandwidth()/2 + xScale(d.Year))
     })
     .style("fill", "black"),
      // + HANDLE ENTER SELECTION
    update => update, // + HANDLE UPDATE SELECTION
    exit => exit.remove()
     // + HANDLE EXIT SELECTION

    )}
  
