d3.csv("./habits_kahl.csv").then(data => {

    console.log("data: ",data)
  
    const table = d3.select("#d3-table");
  
    const body = table.append('tbody').attr("id", "4567")
  
    // d3.select("d3-table")
    //   .append("tbody")
    //   .append("tr")
  
    const rows = body.selectAll(".row")
      .data(data)
      .join ('tr')
      .attr ('class', 'row')
     
  
    const cells = rows
      .append("td")
      .text (d => d["Date"])
    
  
    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        // update the below logic to apply to your dataset
        .attr("class", d => +d > 3 ? 'high' : null)
        .text(d => d);
})