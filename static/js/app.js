

function buildCharts(commodity) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartUrl = `/by_state/${commodity}`;

  // @TODO: Build a Bubble Chart using the sample data
  d3.json(chartUrl).then(function (response) {
    
    var inventory = response.Inventory;
    var state = response.state;

    var stateBar = [{
      x: state,
      y: inventory,
      hovertext: inventory,
      hoveringo: 'hovertext',
      type: 'bar'
    }];

    var layout = {
      height: 500,
      width: 1000
    };

    Plotly.newPlot('stateBar', stateBar, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((commodityName) => {
    commodityName.forEach((commodity) => {
      selector
        .append("option")
        .text(commodity)
        .property("value", commodity);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = commodityName[0];
    buildCharts(firstSample);
    // buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  // buildMetadata(newSample);
}



// Initialize the dashboard
init();
