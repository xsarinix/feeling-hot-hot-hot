
d3.select(window)
.on("mousemove", mousemove)
.on("mouseup", mouseup);

var width = 800,
height = 500
height2 = 200
width2 = 300
ortho = true
focoused = false
globe_flag = true
rotation_flag = true
data_flag = true;

var filepath;   	
var margin = {top: 10, right: 50, bottom: 50, left: 50};

// Set the ranges
var x = d3.time.scale().range([0, width2]);
var y = d3.scale.linear().range([height2, 0]);

// Define the axes
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(10);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left").ticks(5);


    
// Projection for Globe
var projectionGlobe = d3.geo.orthographic()
  .scale(220)
  .translate([width / 2, height / 2])
  .clipAngle(90);

// Projection for Map
var projectionMap = d3.geo.equirectangular()
  .scale(145)
  .translate([width / 2, height / 2]);	

var proj;

var graticule = d3.geo.graticule();

var colorScale = d3.scale.threshold()
  .domain([-32, 0, 20, 29])
  .range(["#FF0000", "#8B0000", "#800000", "#FF6347", "#6a51a3"])

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("mousedown", mousedown);           


var svg2 = d3.select("body")
  .append("svg")
  .attr("width", width2 + margin.left + margin.right)
  .attr("height", 300 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class","svg2");       			
        
var data = d3.map();
console.log(data)
transform();

function transform() {
  if (data_flag == true){
    filepath =  "TempByCountry03-13.csv";
    colorScale = d3.scale.linear()
      .domain([-32, 29])
      .interpolate(d3.interpolateRgb)
      .range(["orange","red"]);		
  }
  else{
    filepath = "percent_change.csv";
    colorScale = d3.scale.linear()
      .domain([-1, 1])
      .interpolate(d3.interpolateRgb)
      .range(['orange', 'red']);
  }				        
  queue()
  .defer(d3.json, "https://unpkg.com/world-atlas@1/world/110m.json")
  .defer(d3.csv, filepath, function(d){
    data.set(d.Code, +d.AverTempYear); 
  })
  .await(ready);
};

function ready(error, world){
  if (error) throw error;
	  
  if (globe_flag == true) {
    proj = projectionGlobe;
  }
  else{
    proj = projectionMap;
  }
  var path = d3.geo.path().projection(proj);

  var colorLegend = d3.legend.color()
    .labelFormat(d3.format(".1f"))
    .scale(colorScale)
    .shapePadding(5)
    .shapeWidth(50)
    .shapeHeight(20)
    .labelOffset(12);

  if (globe_flag == true){
    svg.selectAll("path").remove();
    svg.selectAll("*").remove();		
    var ocean_fill = svg.append("defs").append("radialGradient")
      .attr("id", "ocean_fill")
      .attr("cx", "75%")
      .attr("cy", "25%");
    ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "#ddf");
    ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "#9ab");

    var globe_highlight = svg.append("defs").append("radialGradient")
      .attr("id", "globe_highlight")
      .attr("cx", "75%")
      .attr("cy", "25%");
    globe_highlight.append("stop")
      .attr("offset", "5%").attr("stop-color", "#ffd")
      .attr("stop-opacity","0.6");
    globe_highlight.append("stop")
      .attr("offset", "100%").attr("stop-color", "#ba9")
      .attr("stop-opacity","0.2"); 

    var globe_shading = svg.append("defs").append("radialGradient")
      .attr("id", "globe_shading")
      .attr("cx", "50%")
      .attr("cy", "40%");
    globe_shading.append("stop")
      .attr("offset","50%").attr("stop-color", "#9ab")
      .attr("stop-opacity","0")
    globe_shading.append("stop")
      .attr("offset","100%").attr("stop-color", "#3e6184")
      .attr("stop-opacity","0.3"); 

    var drop_shadow = svg.append("defs").append("radialGradient")
      .attr("id", "drop_shadow")
      .attr("cx", "50%")
      .attr("cy", "50%");
    drop_shadow.append("stop")
      .attr("offset","20%").attr("stop-color", "#000")
      .attr("stop-opacity",".5")
    drop_shadow.append("stop")
      .attr("offset","100%").attr("stop-color", "#000")
      .attr("stop-opacity","0"); 

    svg.append("ellipse")
      .attr("cx", 440)
      .attr("cy", 450)
      .attr("rx", proj.scale()*.90)
      .attr("ry", proj.scale()*.25)
      .attr("class", "noclicks")
      .style("fill", "url(#drop_shadow)");

    svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class", "noclicks")
      .style("fill", "url(#ocean_fill)"); 

    svg.append("path")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    // Set the color based on temperature         
    svg.selectAll("g")
      .attr("class", "countries") 
      .data(topojson.feature(world, world.objects.countries).features)     	  	
      .enter()
      .append("path")    	       	    	    
      .attr("d", path)
      .attr("fill", function(d)
        {if(data.get(d.id) == null ){return "white";} else {return colorScale(data.get(d.id));}});    	

    svg.append("g")
      .attr("transform", "translate(0, 60)")
      .call(colorLegend);	
    
    // lat long lines
    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule noclicks")
      .attr("d", path); 

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_highlight)");

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)"); 
                  
    var clickevent = svg.append("g")
      .attr("class","countries")
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)       		
      .enter().append("path")
      .attr("d", path); 

    clickevent.on("click", function(d){
      svg2.selectAll("*").remove();				
      // Get the data
      d3.csv("TempByCountry03-13.csv", function(error, data){
        data.forEach(function(x){
        x.Year = x.Year;
        x.AverTempYear = +x.AverTempYear;
        });
        // Scale the range of the data
      data = data.filter(function(x){
        return x.Code == d.id;

      });	 

      // Define the line
      var valueline = d3.svg.line()
        .x(function(d) { return x(new Date(d.Year)); })
        .y(function(d) { return y(d.AverTempYear); });

      x.domain(d3.extent(data, function(d) { return new Date(d.Year); }));
      y.domain([d3.min(data, function(d) { return +d.AverTempYear; }), d3.max(data, function(d) { return d.AverTempYear; })]);

      // Add the valueline path.
      svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

      // Add the X Axis
      svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis);

      // Add the Y Axis
      svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis);
      });  
    });
  }
  else {     
    svg.selectAll("path").remove();
    svg.selectAll("*").remove();

    svg.selectAll("path")
      .attr("class", "countries")  
      .data(topojson.feature(world, world.objects.countries).features) 
      .enter()
      .append("path")    	       	    	    
      .attr("d", path)
      .attr("fill", function(d)
        {if(data.get(d.id) == null ){return "white";} else {return colorScale(data.get(d.id));}});  

    svg.append("g")
      .attr("transform", "translate(0, 180)")
      .call(colorLegend);	

    var clickevent2 = svg.append("g").attr("class","countries")
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)       		
      .enter()
      .append("path")
      .attr("d", path);

    clickevent2.on("click", function(d){

      svg2.selectAll("*").remove();	
      //var parseDate = d3.time.format("%y").parse;			
      // Get the data
      d3.csv("TempByCountry03-13.csv", function(error, data) {
        data.forEach(function(x) {
        x.Year = x.Year;
        x.AverTempYear = +x.AverTempYear;
        });
        // Scale the range of the data
      data = data.filter(function(x){
        return x.Code == d.id;
      });	 

      // Define the line
      var valueline = d3.svg.line()
        .x(function(d) { return x(new Date(d.Year)); })
        .y(function(d) { return y(+d.AverTempYear); });

      x.domain(d3.extent(data, function(d) { return new Date(d.Year); }));
      y.domain([d3.min(data, function(d) { return d.AverTempYear; }), d3.max(data, function(d) { return d.AverTempYear; })]);
                
      // Add the valueline path.
      svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

      // Add the X Axis
      svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis);

      // Add the Y Axis
      svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis);
      });  
    });  	
  }

  if (globe_flag == true){
    globe_flag = false;
    rotation_flag = true;
  }
  else{
    globe_flag = true;
    rotation_flag = false;
  }
};

function transform2() {
  if (data_flag == true) {
    data_flag = false;		
  }
  else{
    data_flag = true;
  }

  if (globe_flag == true){
    globe_flag = false;
    rotation_flag = true;
  }
  else{
    globe_flag = true;
    rotation_flag = false;
  }

  transform();
};

var m0, o0;

function mousedown() {
  if(rotation_flag == true){	
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
}

function mousemove() {
  if(rotation_flag == true){
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
      var o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
        o1[1] < -30 ? -30 :
        o1[1];
      proj.rotate(o1);   
      refresh();
    }
  }
};

function mouseup() {
  if(rotation_flag == true){
    if (m0) {
      mousemove();
      m0 = null;
    }
  }
} 


function refresh() {
  var path = d3.geo.path().projection(proj);	
  svg.selectAll(".land").attr("d", path);
  svg.selectAll("path").attr("d",path);
  svg.selectAll(".countries").attr("d", path); 
  svg.selectAll(".countries features").attr("d", path) ;
  svg.selectAll(".countries path").attr("d", path);
  svg.selectAll(".graticule").attr("d", path);
  svg.selectAll(".point").attr("d", path);        	
}