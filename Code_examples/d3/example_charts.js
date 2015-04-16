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


function default_boxname(boxname) {

}


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


  var margin = {top: 20, right: 20, bottom: 120, left: 40};
  var width = boxwidth - margin.left - margin.right;
  var height = boxheight - margin.top - margin.bottom;

  var svg = d3.select(boxname)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(margin.left,margin.top)");

  //--------------------------------------------------
  //Set up scales and axes
  //--------------------------------------------------
  var xScale = d3.scale.ordinal()
    .domain(dataset.map(function(d) {
      return d[0];
    }))
    .rangeRoundBands([0, width]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
      return d[1];
    })])
    .rangeRound([height, 0]);

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
    .attr("transform", "translate(0, chartheight)")
    .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  svg.append("g")
    .attr("class", "y axis lineaxis")
    .call(yAxis);

  //--------------------------------------------------
  // Plot data
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

  svg.selectAll("line.horizontalGrid")
    .data(yScale.ticks(10))
    .enter()
    .append("line")
    .attr({
      "class":"horizontalGrid",
      "x1" : margin.right,
      "x2" : width,
      "y1" : function(d){ return yScale(d);},
      "y2" : function(d){ return yScale(d);}
    });
}


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
		//		return "rgb(0,0, " + (i*100) + ")";
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
}


function colchart(dataset, boxname='.chart-holder', boxwidth=400, boxheight=300) {

  // Sort high to low based on counts.
  usort($data, function($x,$y){
    return $y[1] - $x[1];
  });

  // Switches
  var responsive_axis = "true"; //y axis goes from 0 to 100 if false; 0 to max($data) if true
  var axistext = "%";

  var barsize_pixels = 50;
  var barsize_pixels_active = true; // false if barsize should be evaluated as percentage (0-1), true if real pixel size (X pixel width)
  var barsize = 0.5; // .5 for half sized, 1 for full sized, etc
  if($arsize_pixels == false) {
    barsize = min(barsize, 1);
  }

  var margin = {top: 20, right: 20, bottom: 50, left: 50};
  var width = boxwidth - margin.left - margin.right;
  var height = boxheight - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal()
    .domain(dataset.map(function(d) {
        return d[0];
    }))
    .rangeBands([0, width]);

  if (responsive_axis == true)
  {
      var yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) {
          return d[1];
      })])
      .range([height,0]);
  }
  else
  {
      var yScale = d3.scale.linear()
      .domain([0, 1])
      .range([height,0]);
  }

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    //.attr("transform", "translate(80,0)")
    .orient("left")
    .ticks(10)
    .tickFormat(function(d) {
      return d + "axistext";
    });

  var svg = d3.select(boxname)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis baraxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll(".tick text")
    .call(wrap, xScale.rangeBand());

  svg.append("g")
    .attr("class", "y axis baraxis")
    .call(yAxis);

  svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
         return xScale(d[0]) + xScale.rangeBand()*(1-barsize)/2;
    })
    .attr("width", function() {
      return (barsize_pixels_active ? barsize_pixels : xScale.rangeBand()*barsize)
      //return xScale.rangeBand()*barsize
    })
    .attr("y", function(d) {
        return yScale(d[1]);
    })
    .attr("height", function(d) {
      return height - yScale(d[1]);
    });

  svg.selectAll("bartext")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class", "bartext")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return(d[1]);
    })
     .attr("x", function(d) {
      return xScale(d[0]) + xScale.rangeBand()*1/2;
    })
    .attr("y", function(d) {
      return yScale(d[1]) + 15;
    });
}


/*

BEWARE: this will only work if you also load these files in your HTML code:

  <script src='../media/js/topojson.v1.min.js'></script>
  <script src='../media/js/d3-tip.js'></script>

Example dataset:
$dataset_in = [["Sa`dah",0],["Al Hudaydah",.10],["Al Mahwit",.15],["Dhamar",.07],
["Hajjah",.20],["Amran",.17],["Ibb",.25],["Lahij",.15],["Ta`izz",.04],["Al Mahrah",.15],
["Al Bayda'",.17],["Al Dali'",.05],["Al Jawf",.15],["Shabwah",.21],["Ma'rib",.06],
["Sana'a",.14],["Hadramawt",.10],["Amanat Al Asimah",.20],["Raymah",.03],["`Adan",.07],
["Abyan",.04]];
*/

function choropleth(dataset, mapfile, boxname='.chart-holder', boxwidth=400, boxheight=300) {

    //FIXIT: Calculate map width and centre point
    var mapwidth;
    var mapcenter;

    var maxcolour = 1; //Assume we're working with percentage values - is easier!

    var width = boxwidth;
    var height = boxheight;

    var legend_width = 20;
    var legend_height = 20;

    //Set mapping from values to colours
    var quantize = d3.scale.quantize()
        .domain([0, maxcolour])
        .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));

    //Get dataset into a form D3 can read
    var dataset = d3.map();
    for (var i in dataset_in) {
      dataset.set(dataset_in[i][0], dataset_in[i][1]);
    }

    //initialise the tooltip
    var tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d){
        return '<strong>' + d.id + '</strong> <span class=\'highlight\'>' + dataset.get(d.id) + ' Incidents</span>';
      })

    var svg = d3.select(boxname)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    //invoke tooltip for this context
    svg.call(tooltip);

    var projection = d3.geo.mercator()
      .center([mapcenter[0],mapcenter[1]])
      .scale(mapsize)
      .translate([width/2, height/2]);

    var path = d3.geo.path()
      .projection(projection);

    d3.json('mapfile', function (error, topology) {
      if (error) return console.error(error);
      var subunits = topojson.feature(topology, topology.objects.subunits);

      svg.append('path')
        .datum(subunits)
        .attr('d', path);

      svg.selectAll('.subunit')
          .data(topojson.feature(topology, topology.objects.subunits).features)
          .enter().append('path')
          .attr('class', function(d) {
            return quantize(dataset.get(d.id))
          })
          .style('cursor', 'pointer')
          .classed('region', 'true')
          .attr('d', path)
          .on('mouseover', tooltip.show)
          .on('mouseout', tooltip.hide)
        ;
    });

  // Add legend to visualisation
  var legend = svg.selectAll('g.legend')
    .data(quantize.range().reverse())
    .enter()
    .append('g')
    .attr('class', 'legend');

  legend.append('rect')
    .attr('x', 20)
    .attr('y', function(d, i){
      return height - (i*ls_h) - 2*ls_h;
    })
    .attr('width', legend_width)
    .attr('height', legend_height)
    .style('stroke', 'black')
    .style('stroke-width', 1)
    .attr('class', function(d) {
      var extent = quantize.invertExtent(d);
      return quantize(extent[0]);
    });

  legend.append('text')
    .attr('x', 50)
    .attr('y', function(d, i){
      return height - (i*ls_h) - ls_h - 4;
    })
    .text(function(d){
      var extent = quantize.invertExtent(d);
      var format = d3.format('0.2f');
      return format(+extent[0]);
    });
}
