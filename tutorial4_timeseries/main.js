

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
  selection: "All", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../tutorial3_distributions/NYC_Death.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  const cleandata = raw_data.filter(r => !isNaN( Number.parseFloat( r["Age Adjusted Death Rate"])))
  console.log("raw_data", raw_data);
  window.data = raw_data;
  state.data = cleandata;
  
  const groupdata = d3.rollups(cleandata, v => d3.sum(v,d => d.Deaths), d => d.Year).sort((a,b) => a[0] -b[0])
  const maledata1 = cleandata.filter(d => d.Sex === "M")
  const femaledata1 = cleandata.filter(d => d.Sex ==="F")
  const maledata = d3.rollups(maledata1, v => d3.sum(v,d => d.Deaths), d => d.Year).sort((a,b) => a[0] -b[0])
  const femaledata = d3.rollups(femaledata1, v => d3.sum(v,d => d.Deaths), d => d.Year).sort((a,b) => a[0] -b[0])
  console.log('group',groupdata)
  console.log('male',maledata)
  console.log('female', femaledata)
  
  state.alldata = groupdata
  state.data = groupdata
  state.maledata = maledata
  state.femaledata = femaledata
  // ^line above is "All" --> make it my default
  //const femaledata = d3.rollu
  //all data (year, number) then same for female and male 
  // console.log ('groupdata: ', groupdata)
  //female data, male data, all data 
  
  
  init();
});
//d3.json(YOUR_DATA_PATH, d3.autoType).then(raw_data => {
//console.log("raw_data", raw_data);
//state.data = raw_data;


/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in



/*
steps: 
1. aggregate the deaths (for all causes) per year
2. filter the data 
male and female 
3. write the code under "draw" 
4. three different lines depending on the filter selection 
*/

function init() {
  const years = data.map(d => d.Year)
  const setOfYears = new Set(years)
  const sortedYears = Array.from(setOfYears).sort()
  
 
    
xScale = d3.scalePoint()
.domain(sortedYears)
// .domain([...new Set(data.map(d => d.Year))].sort())
//above code is JS, mapping array, instead of having an "object", now as a year/integer
//triple dot is the spread operater [...[1,2,3]]
.range([margin.left, width - margin.right])
// .paddingInner(.2)
// .paddingOuter(.2)
//.align(config.align)
//.round(config.round)
  
console.log('x dom: ', xScale.domain())
  yScale = d3
  .scaleLinear()
  .domain(d3.extent(state.data, d => d[1]))
  .range([height - margin.bottom, margin.top]);
  
  
  // + UI ELEMENT SETUP
  
  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected party is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    // state.selectedParty = this.value;
    // state.selectedSex = "All"
    //if(this.value === "Male") state.selectedSex = "M"
    //if(this.value === "Female") state.selectedSex = "F"
    state.data = state.alldata 
    if(this.value === "Male") state.data = state.maledata
    if(this.value === "Female") state.data= state.femaledata
    draw(); // re-draw the graph based on this new selection
  });
  
  // add in dropdown options from the unique values in the data
  selectElement
  .selectAll("option")
  .data(["All", "Male", "Female"]) // + ADD DATA VALUES FOR DROPDOWN
  .join("option")
  .attr("value", d => d)
  .text(d => d);
  
  svg = d3
  .select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  
  // AXES

  svg.append('g')
  .attr('class', 'y-axis')
  .style('transform', 'translate(50px, 0)')
  .call(d3.axisLeft(yScale))

svg.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${height - margin.top - 20})`)
  .call(d3.axisBottom(xScale)
  .tickValues(sortedYears)
  .tickFormat(d3.format("0")))


  draw()  
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {

  yScale = d3
  .scaleLinear()
  .domain(d3.extent(state.data, d => d[1]))
  .range([height - margin.bottom, margin.top]);
  
  window.state = state
  window.yScale = yScale


  // prepare a helper function
  var lineFunc = d3.line()
  .x(function(d) {
    console.log("xscale: ", d, 'val: ', xScale(d[0]))
    return xScale(d[0]) })
  .y(function(d) {
    console.log("yscale: ", d, 'val: ', yScale(d[1]))
    return yScale(d[1]) })

    svg.select(".y-axis")
    .call(d3.axisLeft(yScale))
  
  // Add the path using this helper function
  // svg.append('path')
  //   .attr('d', lineFunc(state.data))
  //   .attr('stroke', 'black')
  //   .attr('fill', 'none');
  console.log('svg: ', svg)
  console.log('state .data : ', state.data)
   svg
  .selectAll(".line")
  .data([state.data])
  .join(
    enter => enter
      .append("path")
      .attr('fill', 'none')
      .attr('class', 'line')
      .attr('stroke', 'rebeccaPurple')
      .attr('stroke-width', 2)

      , // + HANDLE ENTER SELECTION
    update => update,
    exit => exit // + HANDLE EXIT SELECTION
    ).attr("d", d=> {
      console.log('data: ', d, 'val:', lineFunc(d));  
    return lineFunc(d)
  });
    
    // + DRAW LINE AND AREA
    
  }