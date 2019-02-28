function buildTable(sample) {
  console.log("Building table...")
}

function buildGlobe(sample) {
  console.log("Building globe..")
}

function buildMap() {
  d3.json(`/data`, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
  });
  d3.select("#visualizations")
    .append("div")
    .attr("id", "map");
  // function createMap(temperature) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      // Temperature: temperature
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  // }
}

function buildVisual(visual) {
  console.log("Building visual...");

  // Use d3 to select the visualization div
  var visualDiv = d3.select("#visualizations");

  // Use `.html("") to clear any existing metadata
  visualDiv.html("");

  // Call the javascript which builds the specific visualization    
  if (visual == "map") {
    buildMap();
  }
  
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selVisual");
  const firstVisual = selector.node();
  buildVisual(firstVisual);
  console.log("Initial visualization:", firstVisual);
}

function optionChanged(newVisual) {
  // Fetch new data each time a new sample is selected
  console.log("New visualization:", newVisual);
  buildVisual(newVisual);
}

// Initialize the dashboard
init();
