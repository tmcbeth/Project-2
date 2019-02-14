var myMap = L.map('map').setView([37.8, -96], 3);

var base = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.light',
  accessToken: API_KEY
}).addTo(myMap)

var stateNumbers = "/co2"
d3.json(stateNumbers).then(function (co2) {
  
 
  var co2_2016 = co2.CO2_2016;

  var stateLines = "/usStates"

  d3.json(stateLines).then(function (data) {
    var stateData = data;
    var test = [];
    
    for (var i = 0; i < stateData.features.length; i++) {
      stateData.features[i].properties.density = co2_2016[i];
    }
    
    L.geoJson(stateData).addTo(myMap);

    function getColor(d) {
      return d > 150000000 ? '#99000d' :
        d > 100000000 ? '#cb181d' :
          d > 50000000 ? '#ef3b2c' :
            d > 25000000 ? '#fb6a4a' :
              d > 10000000 ? '#fc9272' :
                d > 5000000 ? '#fcbba1' :
                  d > 1000000 ? '#fee0d2' :
                    '#fff5f0';
    }
   
    
    function style(feature) {
      return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }
  
    L.geoJson(stateData, { style: style }).addTo(myMap);
    
    function highlightFeature(e) {
      var layer = e.target;
  
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }
    
    
    var geojson;

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update()
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }
    
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }
    
  
    geojson = L.geoJson(stateData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(myMap);
    
    var info = L.control();

    info.onAdd = function (myMap) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };
    

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
      this._div.innerHTML = '<h4>CO2 Emissions</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' Tons'
        : 'Hover over a state');
    };

    info.addTo(myMap);

    // Add legend

    var legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 5, 10, 25, 50, 100, 150],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor((grades[i]*1000000) + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + 'M<br>' : 'M+');
    }

    return div;
    };
    
    legend.addTo(myMap);
    
  });
});






// Adding livestock markers
function buildCommodityMap(commodity) {

  var commoditymapUrl = `/by_state/${commodity}`;
  
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(commoditymapUrl).then(function (response) {

    var state = response.state;
    var inventory = response.Inventory;

    

    function markerSize(inventory) {
      return inventory / 10;
    }

    var inventory_parsed = []

    inventory.forEach(function (data) {
      data = data.replace(/,/g, "")
      parseInt(data, 10)
      data = +data
      inventory_parsed.push(data)
    });

    var stateMarkerData = []

    state.forEach(function (e, i) {
      stateMarkerData.push({
        state: e,
        inventory: inventory_parsed[i],
      })
    });

    console.log("stateMarkerData length", stateMarkerData.length);
    console.log("First State", stateMarkerData[1].state);

    
    var stateMarkerData2 = [];
    var stateCirclesArray = [];


    var statesCoord = [
      {
        name: "Alabama",
        location: [32.806671, -86.791130]
      },
      {
        name: "Alaska",
        location: [61.370716, 	-152.404419]
      },
      {
        name: "Arizona",
        location: [33.729759, -111.431221]
      },
      {
        name: "Arkansas",
        location: [34.969704, -92.373123]
      },
      {
        name: "California",
        location: [36.116203, -119.681564]
      },
      {
        name: "Colorado",
        location: [39.059811, 	-105.311104]
      },
      {
        name: "Connecticut",
        location: [41.597782, -72.755371]
      },
      {
        name: "Delaware",
        location: [39.318523, -75.507141]
      },
      {
        name: "District of Colombia",
        location: [38.897438, -77.026817]
      },
      {
        name: "Floria",
        location: [27.766279, -81.686783]
      },
      {
        name: "Georgia",
        location: [33.040619, -83.643074]
      },
      {
        name: "Hawaii",
        location: [21.094318, -157.498337]
      },
      {
        name: "Idaho",
        location: [44.240459, -114.478828]
      },
      {
        name: "Illinois",
        location: [40.349457, -88.986137]
      },
      {
        name: "Indiana",
        location: [39.849426, -86.258278]
      },
      {
        name: "Iowa",
        location: [42.011539, -93.210526]
      },
      {
        name: "Kansas",
        location: [38.526600, -96.726486]
      },
      {
        name: "Kentucky",
        location: [37.668140, -84.670067]
      },
      {
        name: "Louisiana",
        location: [31.169546, -91.867805]
      },
      {
        name: "Maine",
        location: [44.693947, -69.381927]
      },
      {
        name: "Maryland",
        location: [39.063946, -76.802101]
      },
      {
        name: "Massachusetts",
        location: [42.230171, -71.530106]
      },
      {
        name: "Michigan",
        location: [43.326618, -84.536095]
      },
      {
        name: "Minnesota",
        location: [45.694454, -93.900192]
      },
      {
        name: "Mississippi",
        location: [32.741646, -89.678696]
      },
      {
        name: "Missouri",
        location: [38.456085, -92.288368]
      },
      {
        name: "Montana",
        location: [46.921925, -110.454353]
      },
      {
        name: "Nebraska",
        location: [41.125370	, -98.268082]
      },
      {
        name: "Nevada",
        location: [38.313515, -117.055374]
      },
      {
        name: "New Hampshire",
        location: [43.452492, -71.563896]
      },
      {
        name: "New Jersey",
        location: [40.298904, -74.521011]
      },
      {
        name: "New Mexico",
        location: [34.840515, -106.248482]
      },
      {
        name: "New York",
        location: [42.165726, -74.948051]
      },
      {
        name: "North Carolina",
        location: [35.630066, -79.806419]
      },
      {
        name: "North Dakota",
        location: [47.528912, -99.784012]
      },
      {
        name: "Ohio",
        location: [40.388783, -82.764915]
      },
      {
        name: "Oklahoma",
        location: [35.565342, -96.928917]
      },
      {
        name: "Oregon",
        location: [44.572021, -122.070938]
      },
      {
        name: "Pennsylvania",
        location: [40.590752, -77.209755]
      },
      {
        name: "Rhode Island",
        location: [41.680893, -71.511780]
      },
      {
        name: "South Carolina",
        location: [33.856892	, -80.945007]
      },
      {
        name: "South Dakota",
        location: [44.299782, -99.438828]
      },
      {
        name: "Tennessee",
        location: [35.747845, -86.692345]
      },
      {
        name: "Texas",
        location: [31.054487, -97.563461]
      },
      {
        name: "Utah",
        location: [40.150032, -111.862434]
      },
      {
        name: "Vermont",
        location: [44.045876, -72.710686]
      },
      {
        name: "Virginia",
        location: [37.769337, -78.169968]
      },
      {
        name: "Washington",
        location: [47.400902, -121.490494]
      },
      {
        name: "West Virginia",
        location: [38.491226, -80.954453]
      },
      {
        name: "Wisconsin",
        location: [44.268543, -89.616508]
      },
      {
        name: "Wyoming",
        location: [42.755966, -107.302490]
      }
      
    ];



    console.log("marker Size:", stateMarkerData);
    // Create markers 
    var stateMarkers = [];
    for (var i = 0; i < 50; i++) {
      // loop through the cities array, create a new marker, push it to the cityMarkers array
      stateMarkers.push(
        L.circle(statesCoord[i].location, {
          fillOpacity: 0.75,
          color: "blue",
          fillColor: "blue",
          radius: markerSize(inventory_parsed[i])
        }).bindPopup("<h3>" + stateMarkerData[i].state + "</h3><hr><h3> Inventory: "+ inventory_parsed[i] +"</h3>")
      );

      
    }
    
    // Create layer
    stateLayer = L.layerGroup(stateMarkers);


    // Overlays that may be toggled on or off
    var overlayMaps = {
      Livestock: stateLayer
    };
    var baseMaps = {
      Base: base
    }

    
    // Pass our map layers into our layer control
    // Add the layer control to the map
    // L.control.layers(overlayMaps).remove();
    controller = L.control.layers(baseMaps,overlayMaps);
    
    controller.remove(myMap);
    
    
    controller.addTo(myMap);
    
  });



};






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
    buildCommodityMap(firstSample);
    buildCharts(firstSample);
    // buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  
  stateLayer.remove(myMap);
  controller.remove(myMap);
  // overlayMaps.remove(myMap);
  

  buildCommodityMap(newSample);
  buildCharts(newSample);
  // buildMetadata(newSample);
}


// Initialize the dashboard
init();