=====================================================================
                                                                       
                              ======                                   
                              README                                   
                              ======                                   
                                                                       
               COMP40610 Assignment: Channelling Hans
                           5 December 2018
                                                                       
        D3 javascripts Pograms for Information Visualisation

                Authors: Na Li (17210325), Krunoslav Plecko (17204522)

              web: ~index.html                                            											
=====================================================================


Contents:
---------

1. Overview

2. Package Structure

3. User Manual
   
  - Bubble Charts
  - Bar Chats


----------------------------------------------------------------------

1. Overview:
------------------------------------------------------
In this project, we are visualising multivariate data:
- bubble charts to display country population, GDP and Global Competitiveness Index
- bubble chart with a trail to show historical values with trail
- country labels
- visualization color for bubble and bar chart
- timeline (2007-2017) slider with play button
- slider with play, pause, and year selection
- bubble and bar chart transitions
- clean code structure (js, css, data, d3js folders), chart logic in separate .js files

----------------------------------------------------------------------
Extra features:
- dataset cleaned, missing values replaced with the closest value, country names fixed
- we used dataset subset with values used for visualisation
- interactive bar chart labels (update with country selection)
- labels, X, Y, bubble tooltip
- color selection with interactive buttons, region colors same for all charts
- bar chart with one or two countries (Global Competitiveness Index)
- the bar chart in sync with bubble chart (play, pause and year select)
- country select box with the clear button
- alert for the maximum number of selected countries
- two ways to create country trail; drop down selection menu, country bubble click even during animation



2. Package Structure:
------------------------------------------------------
The web application is structured
- main HTML code in HTML file
- CSS file in a separate folder
- javascript files in separate folders
- charts logic separated in different js files

----------------------------------------------------------------------

3. User Manual:
------------------------------------------------------
===========
Bubble Charts
===========
*Two bubble charts are illustrated in the one html page with a slider to control the years. 

***The key features of first bubble chart (left one in the screen) below,
x-axis: GDP;
y-axis: Global Competitiveness Index;
Each bubble size: the population of a country;
Colour of bubble: region;
Background number: year from 2007 ~ 2017.

***The key features of second bubble chart (right one in the screen) below,
x-axis: GDP;
y-axis: Global Competitiveness Index;
Each bubble size: fix size;
Colour of bubble: region;
Background number: year from 2007 ~ 2017.

***Default variables
Year:          2017
Trail Country: China
Region:        All

*Operation and visualisation for both bubble charts,
1. Click the "play" icon, 
   - "Play" icon will be changed to "Pause" icon; click "Pause" icon, the "Play" icon will be shown again.
   - Slider will slide following the changing years (2007 ~ 2017) automatically;
   - All bubbles in the chart one will animate move following by each year (2007 ~ 2017) automatically;
   - There is a trace for the selected country ("China" by default)following the first chart automatically;
   - Background year number will be changed automatically.
   - Click (do not slide manually) "Slider" on the each year, 
      1).The moving will be stopped and the "Pause" button will be changed to "Play" button at the same time;
	  2).The first bubble chart will be shown all data with the current selected years. 
	  3).The trail bubble chart also will be stopped.
	  4).Click "Play" button at this moment, the two bubble charts will keep moving at the beginning of current year.

2. Click the region legend by different colours buttons on the top right,
   - There is one region bubble chart will be shown on the first bubble chart with the single colour;
   - Click other region, then dynamic showing the selected region bubble chart;
   - Click button "reset", then recover the original fist bubble chart with all regions.
   
3. Change trail by selecting country,
   There are two way to change a country,
   - Click a bubble on the first bubble chart; 
   - Select a country on the dropdown list; when the user click a bubble on the first bubble chart, the dropdown list will be updated at the same time;
   - The colour of each trail is the same with the bubble in the first bubble chart;
   - When changing a new country, then the current trail chart will be removed and updated a new trail;
   - When the trail has shown the full years (2007 ~ 2017), it will be stopped automatically.
   
4. Operation for the first bubble chart,
   When the mouse moves on one bubble, 
   - It will show the tooltip label with Country, GDP, Global Competitiveness Index and population;
   - It will show the X-Y line which are connected with x-axis and y-axis at the same time;
   - The colours of two line are the same with the current bubble.
   - The selected bubble will be zoomed in to highlight what user chooses.
   - When the mouse moves off on one bubble, the tooltips will be disappeared, the bubble size will be recovered.
   

===========
Bar Charts
===========
*Operation and visualisation for both bubble charts
1. Select country to display on the bar chart
   - max number of countries 2
   - country selection will update bar chart labels
   - clear button to remove country selection (bar chart label auto update)
   - play button to start and stop visualisation
   - slider with a timeline to select the year

