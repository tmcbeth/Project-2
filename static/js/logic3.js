var myMapB = L.map('mapB').setView([37.8, -96], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.light',
  accessToken: API_KEY
}).addTo(myMapB)

var stateNumbers = "/state_emission"
d3.json(stateNumbers).then(function (state_emission) {
  
 
  var Methane_Emissions = state_emission.Methane_Emissions;
  
  Methane_Emissions_Parsed = []

    Methane_Emissions.forEach(function (data) {
      data = data.replace(/,/g, "")
      parseInt(data, 10)
      data = +data
      Methane_Emissions_Parsed.push(data)
    });
  
  var stateLines = "/usStates"

  d3.json(stateLines).then(function (data) {
    var stateData = data;
    var test = [];
    
    for (var i = 0; i < stateData.features.length; i++) {
      stateData.features[i].properties.density = Methane_Emissions_Parsed[i];
    }


    L.geoJson(stateData).addTo(myMapB);

    function getColor(d) {
      return d > 20000000 ? '#005824' :
        d > 15000000 ? '#238b45' :
          d > 10000000 ? '#41ae76' :
            d > 5000000 ? '#66c2a4' :
              d > 2500000 ? '#99d8c9' :
                d > 1000000 ? '#ccece6' :
                  d > 500000 ? '#e5f5e0' :
                    '#f7fcf5';
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
  
    L.geoJson(stateData, { style: style }).addTo(myMapB);
    
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
    }).addTo(myMapB);
    
    var info = L.control();

    info.onAdd = function (myMapB) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };
    

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
      this._div.innerHTML = '<h4>Methane Emissions</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' Tons'
        : 'Hover over a state');
    };

    info.addTo(myMapB);

    // Add legend

    var legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, .5, 1, 2.5, 5, 10, 15, 20],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor((grades[i]*1000000) + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + 'M<br>' : 'M+');
    }

    return div;
    };
    
    legend.addTo(myMapB);
    
  });
});


// // Adding livestock markers
// function buildCommodityMap(commodity) {

//   function markerSize(commodity) {
//     return commodity / 100000;
//   }

//   var commoditymapUrl = `/by_state/${commodity}`;
  
//   // @TODO: Build a Bubble Chart using the sample data
//   d3.json(commoditymapUrl).then(function (response) {

//     console.log("pulled data for map:", response.state);

//     var stateLonLat = []

//     console.log("First state:", response.state[1]);

//     for (j = 0; j < response.length; j++) {
      
//       console.log("second state:", response.state[2]);

//       var resultsURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + response[j].state + '&key=AIzaSyBrR9OPKN3ug0EjtnwImWXSzZXPDwENjww';

//       console.log("third state:", response.state[3]);

//       d3.json(resultsURL).then(function (data) {

//         console.log("Results:", data);
  
//         var location = data.results[0].geometry.location;
  
//         console.log("Location:", location);

//         if (location) {
//           stateLonLat.push([location.lat, location.lng]);
//         }
//       });
//     };
//     console.log("StateLonLat:", stateLonLat)

//     for (var i = 0; i < response.length; i++) {
//       L.circle(location[i], {
//         fillOpacity: 0.75,
//         color: "white",
//         fillColor: "blue",
//         // Setting our circle's radius equal to the output of our markerSize function
//         // This will make our marker's size proportionate to its population
//         radius: markerSize(response[i].inventory)
//       }).bindPopup("<h1>" + response[i].state + "</h1> <hr> <h3>Inventory: " + response[i].inventory + "</h3>").addTo(myMapB);
//     }
//   });
    
// };