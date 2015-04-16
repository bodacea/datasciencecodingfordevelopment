/**
 Example D3 functions

 Sara-Jayne Terp
 2015
*/


// From http://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


function create_chart_area(margin, boxname, boxwidth, boxheight) {

  //Set default parameters, if needed
  if (boxname === undefined) {
          boxname = '.chart-holder';
  }
  if (boxwidth === undefined) {
          boxwidth = 400;
  }
  if (boxheight === undefined) {
          boxheight = 300;
  }

  var chartwidth = boxwidth - margin.left - margin.right;
  var chartheight = boxheight - margin.top - margin.bottom;

  var svg = d3.select('.chart-holder')
    .append("svg")
    .attr("width", chartwidth + margin.left + margin.right)
    .attr("height", chartheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  return {
    svg: svg, 
    chartwidth: chartwidth, 
    chartheight: chartheight
  };
};


  //--------------------------------------------------
  //Set up scales and axes
  //--------------------------------------------------
 function create_axes(svg, chartwidth, chartheight) {

  var xScale = d3.scale.ordinal()
    .domain(dataset.map(function(d) {
      return d[0];
    }))
    .rangeRoundBands([0, chartwidth]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
      return d[1];
    })])
    .rangeRound([chartheight, 0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10, "");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    //.attr("transform", "translate(80,0)")
    .orient("left");

  svg.append("g")
    .attr("class", "x axis lineaxis")
    .attr("transform", "translate(0, "+chartheight+")")
    .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  svg.append("g")
    .attr("class", "y axis lineaxis")
    .call(yAxis);

  return {
    svg: svg, 
    xScale: xScale, 
    yScale: yScale
  };
};


/*
Create a line chart

Parameters:
* dataset: Multi-dimensional array. 
  Example dataset: [["2015-02-20",10], ["2015-02-21", 20], ["2015-02-22", 15]]
* boxname: name of the div element for the chart. Should be unique from all other charts
* boxwidth: width of the box containing the chart, in pixels
* boxheight: height of the box containing the chart, in pixels

*/
function linechart(dataset, boxname, boxwidth, boxheight) {

  // Set up drawing area
  var margin = {top: 20, right: 20, bottom: 120, left: 40};
  var chartarea = create_chart_area(margin, boxname, boxwidth, boxheight);
  var svg = chartarea.svg;
  var chartwidth = chartarea.chartwidth;
  var chartheight = chartarea.chartheight;

  // Create axes and scales
  var axes = create_axes(svg, chartwidth, chartheight);
  svg = axes.svg;
  var xScale = axes.xScale;
  var yScale = axes.yScale;

  //--------------------------------------------------
  // Plot dataset
  //--------------------------------------------------
  var lineGen = d3.svg.line()
    //.interpolate("cardinal") //Smoothes out the line a bit
    .x(function(d) {
      return xScale(d[0]) + xScale.rangeBand()/2;
    })
    .y(function(d) {
      return yScale(d[1]);
    });

  svg.append("svg:path")
    .attr("d", lineGen(dataset))
    .attr("stroke", "steelblue")
      .attr("class", "line");

  svg.selectAll("dot")
    .data(dataset)
    .enter().append("circle")
    .attr("fill", "steelblue")
    .attr("r", 5)
    .attr("cx", function(d) { return xScale(d[0]) + xScale.rangeBand()/2; })
    .attr("cy", function(d) { return yScale(d[1]); })

  //--------------------------------------------------
  // Adjust axes to fit dataset
  //--------------------------------------------------
  svg.append("g")
    .attr("class", "gridline")
    .selectAll("line.horizontalGrid")
    .data(yScale.ticks(10))
    .enter()
    .append("line")
    .attr({
      "class":"horizontalGrid",
      "x1" : margin.right,
      "x2" : chartwidth,
      "y1" : function(d){ return yScale(d);},
      "y2" : function(d){ return yScale(d);}
    });

};




function barchart(dataset, boxname='.chart-holder', boxwidth=400, boxheight=300) {

  // Switches
  var responsive_axis = "true"; //x axis goes from 0 to 100 if false; 0 to max($data) if true
  var axistext = "%";

  var barsize_pixels = 25;
  var barsize_pixels_active = true; // false if barsize should be evaluated as percentage (0-1), true if real pixel size (X pixel width)
  var barsize = 0.5;
  if (barsize_pixels == false) {
    barsize = min(barsize, 1);
  }

  var margin = {top: 20, right: 20, bottom: 30, left: 200};
  var width = boxwidth - margin.left - margin.right;
  var height = boxheight - margin.top - margin.bottom;

  //    dataset = dataset.sort(function(a,b) {
  //      return a[1] > b[1];
  //    });

  var svg = d3.select(boxname)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(margin.left,margin.top)");

  if (responsive_axis == true)
  {
    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[1];
        })])
        .range([0, width]);
  }
  else
  {
    var xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, width]);
  }

  var yScale = d3.scale.ordinal()
    .domain(dataset.map(function(d) {
        return d[0];
    }))
    .rangeBands([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10)
    .tickFormat(function(d) {
      return d + "axistext";
    });

  var yAxis = d3.svg.axis()
    .scale(yScale)
    //.attr("transform", "translate(80,0)")
    .orient("left");

  svg.append("g")
    .attr("class", "x axis baraxis")
    .attr("transform", "translate(0, boxheight)")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis baraxis")
    .call(yAxis);


  svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("width", function(d) {
        return xScale(d[1]);
    })
    .attr("y", function(d) {
        return yScale(d[0]) + yScale.rangeBand()*(1-barsize)/2;
    })
    //.attr("fill", "steelblue")
    //.attr("fill", function(d, i) {
    //    return "rgb(0,0, " + (i*100) + ")";
    //})
    .attr("height", function(d) {
      return (barsize_pixels_active ? barsize_pixels : yScale.rangeBand()*barsize)
    });

  svg.selectAll("bartext")
    .data(dataset)
    .enter()
    .append("text")
    .attr("text-anchor", "right")
    .attr("class", "bartext")
    .text(function(d) {
      return(d[1]);
    })
     .attr("x", function(d) {
      return xScale(d[1]) - 35;
    })
    .attr("y", function(d) {
      return yScale(d[0]) + yScale.rangeBand()*1/2;
    });
};


