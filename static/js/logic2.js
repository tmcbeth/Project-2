var myMap = L.map('map').setView([37.8, -96], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
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

  function markerSize(inventory) {
    return inventory / 10;
  }
  
  var commoditymapUrl = `/by_state/${commodity}`;
  
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(commoditymapUrl).then(function (response) {

    var state = response.state;
    var inventory = response.Inventory;

    inventory.forEach(function(data) {
      data = +data;
    });

    console.log(response);

    inventory_Parsed = []
  
      inventory.forEach(function (data) {
        data = data.replace(/,/g, "")
        parseInt(data, 10)
        data = +data
        inventory_Parsed.push(data)
      });
    
    console.log("data parsed", inventory_Parsed);

    var stateLonLat = []  

    for (j = 0; j < 50; j++) {
      
      var resultsURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + response.state[j] + '&key=AIzaSyBrR9OPKN3ug0EjtnwImWXSzZXPDwENjww';
     
      d3.json(resultsURL).then(function (data) {

        // console.log("Results:", data);
        var location = data.results[0].geometry.location;
        // console.log("Location:", location);

        if (location) {
          stateLonLat.push([location.lat, location.lng]);
        }
      });
    };

    console.log("StateLonLat:", stateLonLat);


      var concentration = L.circle([stateLonLat], {
        fillOpacity: 1,
        color: "white",
        fillColor: "blue",
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: 300
      })
   myMap.addLayer(concentration);
  });
    
};



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
    // buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCommodityMap(newSample);
  // buildMetadata(newSample);
}



// Initialize the dashboard
init();