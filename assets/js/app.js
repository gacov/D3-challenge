// @TODO: YOUR CODE HERE!

// defining svg measurements and margins

let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from data.csv
d3.csv("assets/data/data.csv")
    .then(usdata=>{
        console.log(usdata)

        usdata.forEach(d=>{
            d.healthcare = +d.healthcare
            d.poverty = +d.poverty
        })
    
    //create scales
    let xLinearScale = d3.scaleLinear()
        .domain([6, d3.max(usdata, d => d.poverty)+3])
        .range([0,width])
    
    //set up y-axis domain
    let yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(usdata, d => d.healthcare)+3])
        .range([height,0])

    let yMax = d3.max(usdata, d=>d.healthcare)

    //create axes
    let bottomAxis = d3.axisBottom(xLinearScale)
    let leftAxis = d3.axisLeft(yLinearScale)

    //append axes
    chartGroup.append("g")
        .call(bottomAxis)
        .attr("transform",`translate(0,${height})`)

    chartGroup.append("g")
        .call(leftAxis)
    
    //set up generator for chart
    let circlesGroup = chartGroup
        .selectAll("circle")
        .data(usdata)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d.poverty))
        .attr("cy", d=> yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "lightblue")
        .attr("stroke", "white");  

    //set up the legend to appear for tooltip
    chartGroup
        .append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "8px")
        .attr("fill", "white")
        .selectAll("tspan")
        .data(usdata)
        .enter()
        .append("tspan")
        .attr("x", d=> xLinearScale(d.poverty))
        .attr("y", d=> yLinearScale(d.healthcare))
        .text(d=> d.abbr)
    
    // initalize tooltip
    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(d=> (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`))      

    // tooltip in the chart
    chartGroup.call(toolTip);   
    
    // Add an onmouseover event to display a tooltip   
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })

    // Add an on mouseout    
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });

    // Create axes labels  
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");    

    chartGroup
        .append("text")
        .text("In Poverty (%)")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
        .attr("text-anchor", "middle")
        .attr("font-size","16px")
        .attr("fill","black")
  

    })
.catch(e=>{
    console.log(e)
});
