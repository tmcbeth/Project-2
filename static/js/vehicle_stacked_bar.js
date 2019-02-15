// Loop through the Vehicle_Data.js file to obtain information to fill chart

var AUTOMOBILES = [];
var MOTORCYCLES = [];
var BUSES = [];
var TRUCKS = [];
var STATES = [];

console.log(vehicles)
console.log(vehicles.length)

for (var i = 0; i < vehicles.length; i++) {
    STATES.push(vehicles[i].State);
    AUTOMOBILES.push(vehicles[i].Automobiles);
    TRUCKS.push(vehicles[i].Trucks);
    MOTORCYCLES.push(vehicles[i].Motorcycles);
    BUSES.push(vehicles[i].Buses);
};

// See what man hath wrought
console.log(STATES);
console.log(AUTOMOBILES);
console.log(TRUCKS);
console.log(MOTORCYCLES);
console.log(BUSES);

// Cast strings to integers... go fish
fullArray = [AUTOMOBILES, TRUCKS, MOTORCYCLES, BUSES]
for (var x=0; x< fullArray.length; x++){
  for( var i=0; i< fullArray[x].length; i++){
    fullArray[x][i] = +fullArray[x][i].replace(/,/g, '');
  }
};

// See what man hath wrought
console.log(fullArray[0]);
console.log(TRUCKS);
console.log(MOTORCYCLES);
console.log(BUSES);

window.onload = function() {

// REV THOSE ENGINES
// CREATE THE CHART 

var ctx = document.getElementById('canvas') 
console.log(ctx)
console.log(document.getElementById('canvas'))
var vehicle_stacked_bar_chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: STATES,
      datasets: [
        {
        label: ['Automobiles'],
        data: AUTOMOBILES,
        backgroundColor: window.chartColors.blue
        },
        {
        label: ['Trucks'],
        data: TRUCKS, 
        backgroundColor: window.chartColors.purple
        },
        {
        label: ['Buses'],
        data: BUSES,
        backgroundColor: window.chartColors.green
        },
        {
        label: ['Motorcycles'],
        data: MOTORCYCLES,
        backgroundColor: window.chartColors.red
        }  
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Vehicle Numbers By State'
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{stacked: true}],
        yAxes: [{stacked: true}]
      }
    }
  });
};