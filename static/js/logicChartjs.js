function makePlotly1() {
    
    var chartUrl = `/vehicle_gases`;
    d3.json(chartUrl).then(function (response) {
        var state = response.state;
        var Tons_of_Greenhouse_Gas_Emissions = response.Tons_of_Greenhouse_Gas_Emissions;
        var methane_emission = response.methane_emission;
        var CO2_emissions = response.CO2_emissions;
        var total_vehicles = response.total_vehicles;
        var Automobiles = response.Automobiles;
        var Buses = response.Buses;
        var Trucks = response.Trucks;
        var Motorcycles = response.Motorcycles;
       
        var bubble_chart = document.getElementById("bubble-chart");

        console.log("Methane Emissions:", methane_emission);
        console.log("CO2_emissions:", CO2_emissions);
        console.log("total_vehicles:", total_vehicles);

        methane_emissions_parsed = []

        methane_emission.forEach(function (data) {
            data = data.replace(/,/g, "")
            parseInt(data, 10)
            data = +data
            methane_emissions_parsed.push(data)
        });

        CO2_emissions_parsed = []

        CO2_emissions.forEach(function (data) {
            data = data.replace(/,/g, "")
            parseInt(data, 10)
            data = +data
            CO2_emissions_parsed.push(data)
        });

        total_vehicles_parsed = []

        total_vehicles.forEach(function (data) {
            // data = data.replace(/,/g, "")
            // parseInt(data, 10)
            data = data/1000000
            total_vehicles_parsed.push(data)
        });

        console.log("Meth parsed", methane_emissions_parsed);
        console.log("CO2 Parsed", CO2_emissions_parsed);
        console.log("total_vehicles_parsed", total_vehicles_parsed);

        var chartData = [];

        methane_emissions_parsed.forEach(function (e, i) {
            chartData.push({
                x: e,
                y: CO2_emissions_parsed[i],
                r: total_vehicles_parsed[i],
            })
        })

        var chartDataAuto = [];

        methane_emissions_parsed.forEach(function (e, i) {
            chartDataAuto.push({
                x: e,
                y: CO2_emissions_parsed[i],
                r: Automobiles[i]/1000000,
            })
        })

        var chartDataBus = [];

        methane_emissions_parsed.forEach(function (e, i) {
            chartDataBus.push({
                x: e,
                y: CO2_emissions_parsed[i],
                r: Buses[i]/1000000,
            })
        })

        var chartDataTruck = [];

        methane_emissions_parsed.forEach(function (e, i) {
            chartDataTruck.push({
                x: e,
                y: CO2_emissions_parsed[i],
                r: Trucks[i]/1000000,
            })
        })

        var chartDataMoto = [];

        methane_emissions_parsed.forEach(function (e, i) {
            chartDataMoto.push({
                x: e,
                y: CO2_emissions_parsed[i],
                r: Motorcycles[i]/1000000,
            })
        })

        console.log("Chart Data", chartData)
        
        var popCanvas = document.getElementById("bubble-chart");

        Chart.defaults.global.defaultFontFamily = "Arial";
        Chart.defaults.global.defaultFontSize = 14;

    
        var bubbleChart = new Chart(popCanvas, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: ['Circle Size: Total Number of Vehicles'],
                    data: chartData,
                    backgroundColor: "#FF9966",
                }, {
                    label: ['Circle Size: Total Number of Automobiles'],
                    data: chartDataAuto,
                    backgroundColor: "#2ca25f",
                }, {
                    label: ['Circle Size: Total Number of Buses'],
                    data: chartDataBus,
                    backgroundColor: "#1f77b4",
                }, {
                    label: ['Circle Size: Total Number of Trucks'],
                    data: chartDataTruck,
                    backgroundColor: "#d62728",
                }, {
                    label: ['Circle Size: Total Number of Motorcycles'],
                    data: chartDataMoto,
                    backgroundColor: "#36a2eb",
                }],
            },
            options: {
                title: {
                    display: true,
                    text: 'Total Vehicles vs Gas Emissions by State'
                }, scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "CO2 Emissions"
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Methane Emissions",
                        }
                    }]
                },
        
            },
  
        });
    });
}
     
        
makePlotly1();

