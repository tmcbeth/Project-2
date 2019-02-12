function makePlotly1() {
    
    var chartUrl = `/vehicle_gases`;
    d3.json(chartUrl).then(function (response) {
        var state = response.state;
        var Tons_of_Greenhouse_Gas_Emissions = response.Tons_of_Greenhouse_Gas_Emissions;
        var methane_emission = response.methane_emission;
        var CO2_emissions = response.CO2_emissions;
        var total_vehicles = response.total_vehicles;
       
        var bubble_chart = document.getElementById("bubble-chart");
        var vehicle_bubble = new Chart(bubble_chart, {
            type: 'bubble',
            data: data,
            options: {
                title: {
                    display: true,
                    text: 'Total Vehicles by State and Gas Emissions'
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
                }
            },

            label: ["Total Vehicles"],
            backgroundColor: "rgba(193,46,12,0.2)",
            borderColor: "rgba(193,46,12,1)",
            data: [{
                // X Value
                x: methane_emission,
                // Y Value
                y: CO2_emissions,
                // Bubble radius in pixels (not scaled).
                r: total_vehicles,
                    }],
           
               
        });
        
        
        
                

    });
}

makePlotly1();
