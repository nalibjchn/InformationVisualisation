var b_margin = { top: 10, right: 20, bottom: 50, left: 50 };

//Width and height
var b_outer_width = 600;
var b_outer_height = 450;
var b_svg_width = b_outer_width - b_margin.left - b_margin.right;
var b_svg_height = b_outer_height - b_margin.top - b_margin.bottom;


// Selected country
var selected_country_limit = 2;

//Create SVG element as a group with the b_margins transform applied to it
var svg_bar = d3.select("#bar_chart")
    .append("svg")
    .attr("width", b_svg_width + b_margin.left + b_margin.right)
    .attr("height", b_svg_height + b_margin.top + b_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + b_margin.left + "," + b_margin.top + ")");

// Create a scale to scale market Global_Competitiveness_Index values nicely for bar heights
var yScaleB = d3.scaleLinear()
    .domain([0, 5])
    .range([b_svg_height, 0]);

// Create a scale object to nicely take care of positioning bars along the horizontal axis
// We don't set the domain yet as data isn't loaded
var xScaleB = d3.scaleBand()
    .range([0, b_svg_width], 0.1)
    .paddingInner(0.05)
    .paddingOuter(0.05);

//Define Y axis
var yAxisB = d3.axisLeft()
    .scale(yScaleB)
    .ticks(5);

// Create an x-axis connected to the x scale
var xAxisB = d3.axisBottom()
    .scale(xScaleB);

// Call the y axis
svg_bar.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(yAxisB);

//  call the x-axis
svg_bar.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + b_svg_height + ")")
    .call(xAxisB);

// text label for the y axis
svg_bar.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - b_margin.left)
    .attr("x", 0 - (b_svg_height / 2))
    .attr("dy", "1em")
    .attr("opacity", 0.6)
    .style("text-anchor", "middle")
    .text("Global Competitiveness Index (GCI)");


svg_bar.append("text")
    .attr("y", 420)
    .attr("x", 250)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("opacity", 0.6)
    .text("Country");



// create country scroll box
var country_scroll = d3.select("#country_choice_list")
country_scroll.style("overflow-y", "scroll")
    .style("width", "200px")
    .style("height", "200px")

// generate list of countries
function populateCountryList() {
    // check if country select box exist
    var existing_country = document.getElementById("country");
    // add list of countries in select box
    if (typeof (existing_country) == 'undefined' || existing_country == null) {
        for (var i = 0; i < country_list.length; i++) {
            country_scroll.append("label")
                .html("<input id='country' class='country_checkbox' value='" + country_list[i] + "' type='checkbox' onclick='return countryCount()'>" + country_list[i] + "<br>");
        }
    }
}

// count num of selected countries and display alert
function countryCount() {
    var elements = document.getElementsByClassName("country_checkbox");
    var n = 0;
    for (var i in elements) {
        var element = elements[i];
        if (element.checked) n++;
        if (n > selected_country_limit) {
            alert("Pick two countries please ;)");
            element.checked = false;
            return false;
        }
    }
    updateXscaleB()
}

// clear checkbox elements
function countryUncheck() {
    var elements = document.getElementsByClassName("country_checkbox");
    for (var i in elements) {
        var element = elements[i]
        element.checked = false;
    }
    svg_bar.selectAll("rect").remove();
    updateXscaleB();
}

// Function that filters data by year
function yearFilter(value) {
    return (value.Year == display_year)
}

// Function that filters data by country
function CountryFilter(value) {
    return (value.Country == selected_countries[0] || value.Country == selected_countries[1])
}

function getSelectedCountries() {
    countries = Array.from(d3.selectAll(".country_checkbox:checked")._groups[0]);
    selected_countries = countries.map(function (row) { return row.value; });
    return selected_countries;
}

function updateXscaleB() {
    selected_countries = getSelectedCountries();
    xScaleB.domain(selected_countries);
    svg_bar.select("#x-axis");
    // Call the x-axis
    svg_bar.select("#x-axis").call(xAxisB);
}

function rescaleYscaleB() {
    GCI_max = Math.round(GCI_max) + 1
    yScaleB.domain([0, GCI_max])
    svg_bar.select("#y-axis").call(yAxisB);
}

// Define a fucntion to draw a simple bar chart
function generateBarsVis() {
    populateCountryList();

    // filter dataset based on country selection
    var filtered_datset = dataset.filter(CountryFilter);

    // Filter the data to only include the current year
    filtered_datset = filtered_datset.filter(yearFilter);


    updateXscaleB()

    /******** PERFORM DATA JOIN ************/
    // Join new data with old elements, if any.
    var bars = svg_bar.selectAll("rect")
        .data(filtered_datset, function key(d) {
            return d.Country;
        });

    /******** HANDLE UPDATE SELECTION ************/
    // Update the display of existing elelemnts to match new data
    bars
        .attr("x", function (d) {
            return xScaleB(d.Country);
        })
        .attr("y", function (d) {
            return yScaleB(+d.Global_Competitiveness_Index);
        })
        .attr("width", xScaleB.bandwidth())
        .attr("height", function (d) {
            return b_svg_height - yScaleB(+d.Global_Competitiveness_Index);
        });


    /******** HANDLE ENTER SELECTION ************/
    // Create new elements in the dataset
    bars.enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScaleB(d.Country);
        })
        .attr("y", function (d) {
            return yScaleB(+d.Global_Competitiveness_Index);
        })
        .attr("width", xScaleB.bandwidth())
        .attr("height", function (d) {
            return b_svg_height - yScaleB(+d.Global_Competitiveness_Index);
        })
        .style("fill", function (d) { return color(d.Region); })
        .append("title")
        .text(function (d) {
            return "Market GCI: " + d3.format(".2f")(d.Global_Competitiveness_Index);
        });

    /******** HANDLE EXIT SELECTION ************/
    // Remove bars that not longer have a matching data eleement
    bars.exit().remove();


    // Set the year label
    d3.select("#year_header").text("Year: " + display_year)

}