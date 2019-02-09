// var co2_url = "/co2"

// d3.json(co2_url).then(function (response) {

var myMap = L.map('map').setView([37.8, -96], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.light',
  accessToken: API_KEY
}).addTo(myMap)

// var stateLines = "https://docs.mapbox.com/help/demos/choropleth-studio-gl/stateData.geojson"


var stateNumbers = "/co2"
d3.json(stateNumbers).then(function (co2) {
  
 
  var co2_2016 = co2.CO2_2016;
  
  
  console.log("CO2 2016", co2_2016);

  var stateLines = "/usStates"

  d3.json(stateLines).then(function (data) {
    var stateData = data;
    var test = [];
    console.log("areas:", stateData);
    for (var i = 0; i < stateData.features.length; i++) {
      stateData.features[i].properties.density = co2_2016[i];
    }
    console.log(stateData);
    
    L.geoJson(statesData).addTo(myMap);

    function getColor(d) {
      return d > 1000 ? '#800026' :
             d > 500  ? '#BD0026' :
             d > 200  ? '#E31A1C' :
             d > 100  ? '#FC4E2A' :
             d > 50   ? '#FD8D3C' :
             d > 20   ? '#FEB24C' :
             d > 10   ? '#FED976' :
                        '#FFEDA0';
  }


  });
});

// function createFeatures(stateData) {

//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.name +
//       "</h3><hr><p>" + new Date(feature.geometry.type) + "</p>");
//   }
//   var stateBoundary = L.geoJSON(stateData, {
//     onEachFeature: onEachFeature
//   });

//   createMap(states);
// }

// function createMap(states) {

//   var stateMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     maxZoom: 18,
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//       '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     id: 'mapbox.light',
//     accessToken: API_KEY
//   });

//   var baseMaps = {
//     "Street Map": streetmap
//   };

//   var overlayMaps = {
//     States: states
//   };

//   var myMap = L.map('map', {
//     center: [
//       37.09, 95.71
//     ],
//     zoom: 3,
//     layers:[streetmap, states]
//   })

//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }
// // }  





















  // function getColor(d) {
  //   return d > 1000 ? '#800026' :
  //     d > 500 ? '#BD0026' :
  //       d > 200 ? '#E31A1C' :
  //         d > 100 ? '#FC4E2A' :
  //           d > 50 ? '#FD8D3C' :
  //             d > 20 ? '#FEB24C' :
  //               d > 10 ? '#FED976' :
  //                 '#FFEDA0';
  // }

  // function style(feature) {
  //   return {
  //     fillColor: getColor(feature.properties.density),
  //     weight: 2,
  //     opacity: 1,
  //     color: 'white',
  //     dashArray: '3',
  //     fillOpacity: 0.7
  //   };
  // }

  // L.geoJson(statesData, { style: style }).addTo(myMap);

  // // Add interaction

// });