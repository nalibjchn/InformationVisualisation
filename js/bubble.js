
piller_source = ["pillar_Institutions",	
"pillar_Infrastructure",
"pillar_Macroeconomic_environment",
"pillar_Health_and_primary_education",
"pillar_Higher_education_and_training",
"pillar_Goods_market_efficiency",
"pillar_Labor_market_efficiency",
"pillar_Financial_market_development",
"pillar_Technological_readiness",
"pillar_Market_size",
"pillar_Business_sophistication",
"pillar_Innovation"];
//tool tips
var tooltip = d3.select("#core_code")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden")
    .text("tooltip");

//draw slider
var datayear = d3.range(0, 11).map(function (d) { return new Date(2007 + d, 10, 3); });
var slider = d3.sliderHorizontal()
    .min(d3.min(datayear))
    .max(d3.max(datayear))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(500)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(datayear);

var slidergroup = d3.select("div#slider").append("svg")
    .attr("width", 650)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(20,30)");
slidergroup.call(slider);

//initial country list
function initialcounrtylist() {
    var ddcountry = document.getElementById("select_country");
    piller_source.forEach(country => {
        var option = document.createElement("option");
        option.text = country;
        option.value = country;
        if (country == "pillar_Institutions") {
            option.selected = true
            counrty_filter = option.value;
        }
        ddcountry.add(option);
    });
}

//dropdown list click event
function countrychange() {
    selectedCountry = document.getElementById("select_country").value;
    counrty_filter = selectedCountry
    trail_iterate_count = 0;
    if (points_trail_array.length > 1) {
        points_trail_array.forEach(function (d) {
            d.remove();
        });
    }
}

//play button event
function onclickPlay(btnid) {
    if (btnid == "btnplay") {
        document.getElementById("btnplay").style.display = "none";
        document.getElementById("btnpause").style.display = "block";
    }
    else if (btnid == "btnpause") {
        document.getElementById("btnpause").style.display = "none";
        document.getElementById("btnplay").style.display = "block";
    }
}

//onclick slider to show a specific year
function onclickchangeyear() {
    gl_show_year = parseInt(d3.timeFormat('%Y')(slider.value()));
    document.getElementById("btnpause").style.display = "none";
    document.getElementById("btnplay").style.display = "block";
    yearOperation();
    clearInterval(intervaldrawing);
    generateVis();

    // bar chart
    display_year = gl_show_year;
    // get list of selected countries
    selected_countries = getSelectedCountries();
    // Update the visualsiation
    generateBarsVis(dataset);
    // stop loopping
    clearInterval(playInterval);
    // interval listeneer
    var playInterval;
}

// var intervaldrawing btnplay
function playevent() {

    var play = d3.select("#playyear")
        .on("click", function () {
            // get the list of selected countries for bar chart
            selected_countries = getSelectedCountries();
            if (document.getElementById("btnplay").style.display == "none") {
                // bubble chart
                iteratebubble();

                // bar chart
                // Set up the interval callback
                playInterval = setInterval(function () {

                    // Increment the display year
                    display_year++;

                    // Make the display_year loop around from max to min
                    if (display_year > end_year) {
                        display_year = start_year;
                    }
                    // Update the visualsiation
                    updateXscaleB()
                    generateBarsVis();
                }, 500);
            } else {
                // bubble chart
                clearInterval(intervaldrawing);

                // bar chart
                clearInterval(playInterval);
                updateXscaleB()
                selected_countries = getSelectedCountries();
            }
        })
}

//change region from legend
function bubblebylegend(id) {

    switch (id) {
        case "leg_asia":
            gl_show_region = "Emerging and Developing Asia";
            break;
        case "leg_economies":
            gl_show_region = "Advanced economies";
            break;
        case "leg_common":
            gl_show_region = "Commonwealth of Independent States";
            break;
        case "leg_latin":
            gl_show_region = "Latin America and the Caribbean";
            break;
        case "leg_africa":
            gl_show_region = "Sub-Saharan Africa";
            break;
        case "leg_middle":
            gl_show_region = "Middle East, North Africa, and Pakistan";
            break;
        case "leg_europe":
            gl_show_region = "Emerging and Developing Europe";
            break;
        default:
            gl_show_region = "";
    }

    generateVis();
}

function fun_filterRegion(value) {
    return (value.Region == gl_show_region);
}

function fun_filterYear(value) {
    return (value.Year == gl_show_year);
}

function fun_filterCountry(value) {
    return (value.Country == counrty_filter);
}

//iteration of drawing bubble by years
trail_iterate_count = 0;
function iteratebubble() {

    if (points_trail_array.length > 1) {
        points_trail_array.forEach(function (d) {
            d.remove();
        });
    }
    intervaldrawing = setInterval(function () {

        gl_show_year = gl_show_year + 1;
        if (gl_show_year > 2017) {
            gl_show_year = 2007;
        }
        yearOperation(gl_show_year);
        if (trail_iterate_count < 11) {
            generateTrailCircle();
        }
        trail_iterate_count++;
        generateVis();

    }, 800);
}

//update global year variable and slder year value
function yearOperation() {

    slider.value(new Date(gl_show_year, 12, 12)); //setting slider value automatically

    d3.select("#yearbackgroud")
        .attr("class", "yearbackgroud")
        .text(gl_show_year);

    d3.select("#yearbackgroud_trail")
        .attr("class", "yearbackgroud_trail")
        .text(gl_show_year);

    dataset_filteryear = dataset.filter(fun_filterYear);
}

//generation of trail bubble chart
function generateTrailCircle() {

    dataset_filterCountry = dataset.filter(fun_filterCountry);
    dataset_filterCountry_year = dataset_filterCountry.filter(fun_filterYear);

    if (dataset_filterCountry_year.length == 0) { return; }

    points_trail = svg_trail.append("circle")
        .attr("cx", xScale(+dataset_filterCountry_year[0].piller_source[0]))
        .attr("cy", yScale(+dataset_filterCountry_year[0].Global_Competitiveness_Index))
        // .attr("r", rScale(+dataset_filterCountry_year[0].Population))
        .attr("r", 15)
        .style("fill", color(dataset_filterCountry_year[0].Region))
        .attr("opacity", 0.5)
        .style("stroke", "black");

    points_trail_array.push(points_trail);
}

//*******************mouse action on each bubble*******************
//mouse on
var mouseoverclient = function (d) {

    var currentcircle = d3.select(this);
    currentcircle.transition()
        .duration(500)
        .style("opacity", 1)
        .attr("r", 30)
        .ease(d3.easeLinear); //need to be changed

    tooltipstring = "<div><span> Country:" + d.Country + "</span><br><span> GDP:" + d3.format(",d")(d.GDP) + "</span><br><span>GCI:" + d3.format(".2f")(d.Global_Competitiveness_Index) + "</span><br><span> Population:" + d3.format(",d")(d.Population) + "</span></div>"
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip.html(tooltipstring)
        .style("left", (parseInt(d3.select(this).attr("cx")) + 40) + "px")
        .style("top", (parseInt(d3.select(this).attr("cy")) + 350) + "px")
        .style("visibility", "visible");

    //axis x - y line guid line
    //y line 
    svg.append("g")
        .append("line")
        .attr("id", "xy-line")
        .attr("x1", currentcircle.attr("cx"))
        .attr("y1", currentcircle.attr("cy"))
        .attr("x2", currentcircle.attr("cx"))
        .attr("y2", svg_height)
        .style("stroke", function () {
            if (currentcircle.data()[0] != null) { return currentcircle.style("fill"); }
        })
        .style("stroke-dasharray", ("10,3")); // make the stroke dashed

    //x line
    svg.append("g")
        .append("line")
        .attr("id", "xy-line")
        .attr("x1", currentcircle.attr("cx"))
        .attr("y1", currentcircle.attr("cy"))
        .attr("x2", 25)
        .attr("y2", currentcircle.attr("cy"))
        .style("stroke", function () {
            // console.log(currentcircle)
            if (currentcircle.data()[0] != null) { return currentcircle.style("fill") }
        })
        .style("stroke-dasharray", ("10,3")); // make the stroke dashed

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };
};

//mouse off
var mouseoffclient = function () {

    var currentcircle = d3.select(this);

    tooltip.style("visibility", "hidden");
    //return to normal size
    currentcircle.transition()
        .duration(500)
        .ease(d3.easeElastic);
    //x-y line remove
    d3.selectAll("#xy-line")
        .transition()
        .duration(100)
        .remove();
    generateVis();
}

//click circle to select country
var clickcircleclient = function () {
    trail_iterate_count = 0;
    if (points_trail_array.length > 1) {
        points_trail_array.forEach(function (d) {
            d.remove();
            console.log("remove")
        });
    }

    points_trail_array = []
    var currentcircle = d3.select(this);
    if (currentcircle.data()[0] != null) {
        counrty_filter = currentcircle.data()[0].Country;
        document.getElementById("select_country").value = currentcircle.data()[0].Country;
    }
}

//generation of a bubble chart
function generateVis() {

    /******** PERFORM DATA JOIN ************/
    var points;
    if (gl_show_region != "") {
        dataset_filterregion = dataset_filteryear.filter(fun_filterRegion);
        points = svg.selectAll("circle")
            .data(dataset_filterregion);
    } else {
        var points = svg.selectAll("circle")
            .data(dataset_filteryear);
    }
    /******** HANDLE ENTER SELECTION ************/
    // Create new elements in the dataset
    // Perform a data join and add points to the chart
    points.enter()
        .append("circle")
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("cx", function (d) { return xScale(+d.GDP); })
        .attr("cy", function (d) { return yScale(+d.Global_Competitiveness_Index); })
        .attr("r", function (d) { return rScale(+d.Population); })
        .style("fill", function (d) { return color(d.Region); })
        .attr("opacity", 0.8);

    /******** HANDLE UPDATE SELECTION ************/
    // Update the display of existing elelemnts to mathc new data
    // Perform a data join and add points to the chart
    points.transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("cx", function (d) { return xScale(+d.GDP); })
        .attr("cy", function (d) { return yScale(+d.Global_Competitiveness_Index); })
        .attr("r", function (d) { return rScale(+d.Population); })
        .style("fill", function (d) { return color(d.Region); })
        .attr("opacity", 0.8);

    d3.selectAll("circle")
        .on("mouseover", mouseoverclient)
        .on("mouseout", mouseoffclient)
        .on("click", clickcircleclient);
    /******** HANDLE EXIT SELECTION ************/
    // Remove elements that not longer have a matching data eleement
    points.exit().remove();
}

// Load the file Bubble_subdataset.csv and generate a visualisation based on it
d3.csv("./data/Bubble_subdataset.csv").then(function (data) {

    // convert each variable to numeric type and parse the date
    data.forEach(function (d) {
        d['Global_Competitiveness_Index'] = +d['Global_Competitiveness_Index'];
        d['GDP'] = +d['GDP'];
        d['Population'] = +d['Population'];
    });

    dataset = data;

    // get list of countries from dataset
    source_country = dataset.map(function (d) { return d.Country; });
    source_country = source_country.filter((v, i, a) => a.indexOf(v) === i); // sort country list

    // bar chart variables
    country_list = source_country
    start_year = d3.min(dataset.map(function (d) { return +d.Year; }));
    end_year = d3.max(dataset.map(function (d) { return +d.Year; }));
    GCI_max = d3.max(dataset.map(function (d) { return +d.Global_Competitiveness_Index; }));
    // The year to display
    display_year = gl_show_year;
    selected_countries = getSelectedCountries();


    // Generate bubble the visualisation
    initialcounrtylist();
    playevent();
    yearOperation();
    generateVis();

    // Generate bar chart the visualisation
    rescaleYscaleB()
    generateBarsVis(dataset);

});