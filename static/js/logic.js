// Creating map object
var myMap = L.map("map1", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// TODO:

// Store API query variables
var baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// Add the dates in the ISO formats
var date = "$where=created_date between '2018-01-10T12:00:00' and '2018-12-31T00:00:00'";
// Add the complaint type
var complaint = "&complaint_type=Rodent";
// Add a limit
var limit = "&$limit=10000";

// Assemble API query URL

url = baseURL + date + complaint + limit;


// ****************************************************
// ****************** DATA URL ************************
// ****************************************************

// Livestock Data

var restBaseURL = `/by_state/${commodity}`;




// ****************************************************
// ***************** MAP GRAPHS ***********************
// ****************************************************

// Obtain livestock data








// Grab the Rodent data with d3

d3.json(url, function (response) {
  console.log("Rodent Data", response);

  var markers = L.markerClusterGroup();
  
    for (var i = 0; i < response.length; i++) {
      var location = response[i].location;

      if (location) {
        markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
          .bindPopup(`${response[i].street_name}<hr>${response[i].descriptor}`));
      }
      
    }
  
  
  myMap.addLayer(markers);


});


// Grab Restaurant Data & convert address to Lat & Lng

d3.json(restScoreURL, function (response) {

  console.log("Restaurant Data", response);

  var heatArray = []
  
  for (i = 0; i < response.length; i++) {

    var results = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + response[i].street + ',' + response[i].zipcode + '&key=AIzaSyBrR9OPKN3ug0EjtnwImWXSzZXPDwENjww';

    d3.json(results, function (response) {

      console.log("Results:", response);

      var location = response.results[0].geometry.location;

      console.log("Location:", location);

      if (location) {
        heatArray.push([location.lat, location.lng]);
      }

    });
  }
  console.log("HeatArray:", heatArray);


  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);
});
  
