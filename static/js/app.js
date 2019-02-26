function buildVisual(sample) {
  console.log("Building visual...");

  // Use d3 to select the visualization div
  var visualDiv = d3.select("#visualizations");

  // Use `.html("") to clear any existing metadata
  visualDiv.html("");

  // Call the javascript which builds the specific visualization    

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
