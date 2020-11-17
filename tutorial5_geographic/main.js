/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.5,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let rscale;

/**
 * APPLICATION STATE
 * */
let state = {
  // + SET UP STATE
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("ZIP_CODE.json"),
  d3.csv("trees_clean.csv", d3.autoType),
]).then(([geojson, trees]) => {
  // + SET STATE WITH DATA
  state.trees = trees
  state.geojson = geojson
  console.log("state: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
     // create an svg element in our main `d3-container` element
  svg = d3
  .select("#d3-container")
  .append("svg")
  .attr("width", width)
  //.style("border", "1px Solid")
  //.attr("transform", "translate(-50)")
  .attr("height", height);

      // create a tooltip
var tooltip = d3.select("#tooltip")
.append("div")
  .style("position", "absolute")
  .style("background", "white")
  .style("padding", "1rem")
  .style("border", "1px solid forestgreen")
  .style("visibility", "hidden")
  .text("");

//




  //making a new object, lat long to row.
  // object is the key, make lat long the key, based off that, it can identify the row 
  // the point is to use this key to idetify the row, and show the string information on the tool tip 

  // const latLongToRow = new Map()
  // latLongToRow.put([lat, long], row)
  // latLongToRow.put([-70, 41], {...})


  //trying to figure out the chloropleth below... can't seem

  const projection = d3.geoAlbers().fitSize([width, height], state.geojson);
  //const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
  const path = d3.geoPath().projection(projection);

  //2 pie factor not considering, d3 makes something to help us bring in the 2 pieR

rscale = d3.scaleSqrt()
  .domain(d3.extent(state.trees, d => d.count)) // unit: km
  .range([2, 10]) // unit: pixels

  var data = d3.map();
  var colorScale = d3.scaleLinear()
   .domain(d3.extent(state.trees, d => d.count))
   .range(["white", "forestgreen"])
  //  .range(d3.schemeGreens)
//   window.colorscale = colorScale
//   //.join(state.trees)


//  latlongrow = {}
//  state.trees.map(r =>{
//   const k = (r.LAT.toFixed(4)) + (r.LONG.toFixed(4))
//   latlongrow[k] = r})

//   console.log("latlongrow : ",latlongrow)
  

svg
  .selectAll(".state")
  // all of the features of the geojson, meaning all the states as individuals
  .data(state.geojson.features)
  .join("path")
  .attr("d", path)
  .attr("class", "state")
  .attr("fill", "transparent")
  .attr("stroke", "black")
 

  // .on("mouseover", d => {
  //   // when the mouse rolls over this feature, do this
  //  // state.hover[""] = d.properties.NAME;
  //   draw(); // re-call the draw function when we set a new hoveredState
  // });

// EXAMPLE 1: going from Lat-Long => x, y
// for how to position a dot
//const GradCenterCoord = { latitude: 40.7423, longitude: -73.9833 };
svg
  .selectAll("circle")
  .data(state.trees)
  .join("circle")
  .attr("r", d => rscale(d.count))
  .attr("stroke", "rgba(0,0,0,.7)")
  //.style("opacity", .3)
  .attr("fill", function (d) {
   // d.total = data.get(d.id) || 0;
    return colorScale(d.count);})

  .on("mouseover", function(){return tooltip.style("visibility", "visible");})
  .on("mousemove", function(d)
   
  {
    console.log("d:", d)
    return tooltip.style("top", (event.pageY + 10)+"px")
    .style("left",(event.pageX)+"px")
    .html(`<div> Tree Count: ${d.count} </div>
    <div> Zipcode: ${d.postcode}</div>`)})

  
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
  .attr("transform", d => {
    const [x, y] = projection([d.LONG, d.LAT]);
    return `translate(${x}, ${y})`;  
  });

// EXAMPLE 2: going from x, y => lat-long
// this triggers any movement at all while on the svg
//svg.on("mousemove", () => {
  // we can use d3.mouse() to tell us the exact x and y positions of our cursor
//   const [mx, my] = d3.mouse(svg.node());
//   // projection can be inverted to return [lat, long] from [x, y] in pixels
//   const proj = projection.invert([mx, my]);
//   console .log(proj)

// //  const k = (proj[1].toFixed(4)) + (proj[0].toFixed(4))
// //  let SelectedRow = latlongrow[k]
 
// //  console.log("SelectedRow :", SelectedRow)
           
//  // state.hover["longitude"] = proj[0];
//  // state.hover["latitude"] = proj[1];

//   draw();
// });

  // + SET UP PROJECTION
  // + SET UP GEOPATH

  // + DRAW BASE MAP PATH
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {}

//add strokes to circle, opacity would help with the circle lines (attr) or in style
//thinking of different font, back away from jpeg 
//increase svg 
// check out css for centering heders, etc 