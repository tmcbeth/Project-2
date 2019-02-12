function makePlotly1() {
    
    var chartUrl = `/vehicle_gases`;
    d3.json(chartUrl).then(function (response) {
        var state = response.state;
        var Tons_of_Greenhouse_Gas_Emissions = response.Tons_of_Greenhouse_Gas_Emissions;
        var methane_emission = response.methane_emission;
        var CO2_emissions = response.CO2_emissions;
        var total_vehicles = response.total_vehicles;
       
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

        console.log("Chart Data", chartData)
        
        var popCanvas = document.getElementById("bubble-chart");

        Chart.defaults.global.defaultFontFamily = "Arial";
        Chart.defaults.global.defaultFontSize = 14;

        // var popData = {
        //     datasets: [{
        //         label: ['Circle Size: Total Number of Vehicles'],
        //         data: [{
        //             x: 100,
        //             y: 0,
        //             r: 10
        //         }, {
        //             x: 60,
        //             y: 30,
        //             r: 20
        //         }, {
        //             x: 40,
        //             y: 60,
        //             r: 25
        //         }, {
        //             x: 80,
        //             y: 80,
        //             r: 50
        //         }, {
        //             x: 20,
        //             y: 30,
        //             r: 25
        //         }, {
        //             x: 0,
        //             y: 100,
        //             r: 5
        //         }],
        //         backgroundColor: "#FF9966",
      
        
        //     }]
        // };

        var bubbleChart = new Chart(popCanvas, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: ['Circle Size: Total Number of Vehicles'],
                    data: chartData,
                    backgroundColor: "#FF9966",
                }],
            },
            options: {
                title: {
                    display: true,
                    text: 'Total Vehicles by State vs Gas Emissions'
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

