// Define margins
var margin = { top: 5, right: 20, bottom: 30, left: 30 };

//Width and height
var outer_width = 700;
var outer_height = 400;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;

// The global data set object
var dataset;
var dataset_filteryear;
var dataset_filterCountry;
var dataset_filterCountry_year;
var gl_show_year = 2007;
var gl_show_region = "";
var counrty_filter;
var intervaldrawing;
var points_trail_array = [];
var color = d3.scaleOrdinal(d3.schemeAccent);

//Create SVG element as a group with the margins transform applied to it
var svg = d3.select("body")
    .append("svg")
    .attr("width", svg_width + margin.left + margin.right)
    .attr("height", svg_height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scale to be used on the x axis GDP
var xScale = d3.scaleLog()
    .range([0, svg_width - margin.right - 5])
    .domain([50, 160000]);

// Set up the scale to be used on the y axis on the Competitiveness_Index
var yScale = d3.scaleLinear()
    .range([svg_height, 0])
    .domain([0, 7]);

// Set up the scale to be used on the y axis on the population
var rScale = d3.scaleLinear()
    .range([5, 30])
    .domain([90841, 1386395000]);

// Create an x-axis connected to the x scale
var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(3, d3.format(",s"));

//Define Y axis
var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

// Create the x axis
svg.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + margin.left + "," + svg_height + ")");

// Create the y axis
svg.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// text label for x
svg.append("text")
    .attr("x", svg_width / 2 + margin.left)
    .attr("y", svg_height + margin.bottom)
    .style("text-anchor", "middle")
    // .attr("font-family", "Comic Sans Ms")
    .text("GDP")
    .attr("opacity", 0.5);

// text label for y
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (svg_height / 2))
    .attr("dy", "1em")
    .attr("opacity", 0.6)
    // .attr("font-family", "Comic Sans Ms")
    .style("text-anchor", "middle")
    .text("Global Competitiveness Index (GCI)");

//background year
svg.append("text")
    .attr("id", "yearbackgroud")
    .attr("x", svg_height / 2.5)
    .attr("y", svg_width / 3)
    .attr("class", "yearbackgroud")
    .text("2007");

yAxis.tickValues(yScale.ticks(5).concat(yScale.domain()));
xAxis.tickValues(xScale.ticks(3).concat(xScale.domain()));
xAxis.tickFormat(d3.format("~s"));

svg.select("#x-axis").call(xAxis);
svg.select("#y-axis").call(yAxis);

//draw trail svg  
//Create SVG element as a group with the margins transform applied to it
var svg_trail = d3.select("body")
    .append("svg")
    .attr("width", svg_width + margin.left + margin.right)
    .attr("height", svg_height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create the x axis
svg_trail.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis-trail")
    .attr("transform", "translate(" + margin.left + "," + svg_height + ")");

// Create the y axis
svg_trail.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis-trail")
    .attr("transform", "translate(" + margin.left + ")");

// text label for x
svg_trail.append("text")
    .attr("x", svg_width / 2 + margin.left)
    .attr("y", svg_height + margin.bottom - 5)
    .style("text-anchor", "middle")
    // .attr("font-family", "Comic Sans Ms")
    .text("GDP")
    .attr("opacity", 0.5);

// text label for y
svg_trail.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - svg_height / 2)
    .attr("dy", "1em")
    .attr("opacity", 0.6)
    // .attr("font-family", "Comic Sans Ms")
    .style("text-anchor", "middle")
    .text("Global Competitiveness Index (GCI)");

//background year
svg_trail.append("text")
    .attr("id", "yearbackgroud_trail")
    .attr("x", svg_height / 2.5)
    .attr("y", svg_width / 3)
    .attr("class", "yearbackgroud")
    .text("2007");

svg_trail.select("#y-axis-trail").call(yAxis);
svg_trail.select("#x-axis-trail").call(xAxis);

