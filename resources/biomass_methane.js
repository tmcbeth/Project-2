function makeplot() {
    d3.csv("methane_df.csv", function(data){ processData(data) } );

};
    
function processData(allRows) {

    console.log(allRows);
    var state = [], Tons_of_Greenhouse_Gas_Emissions = [], methane_emission = [], CO2_emissions =[], biomass_generation =[], transportation_generation =[];

    for (var i=0; i<allRows.length; i++) {
        row = allRows[i];
        state.push( row['State'] );
        Tons_of_Greenhouse_Gas_Emissions.push( row['Tons of Greenhouse Gas Emissions'] );
        methane_emission.push( row['Methane Emission'] );
        CO2_emissions.push( row['CO2 Emissions'] );
        biomass_generation.push( row['State Biomass Generation'] );
        transportation_generation.push( row['State Transportation Generation'] );
    }
    console.log( 'A',state, 'B',Tons_of_Greenhouse_Gas_Emissions, 'C',methane_emission, 'D',CO2_emissions, 'E',biomass_generation, 'F',transportation_generation);
    makePlotly( state, methane_emission, biomass_generation, CO2_emissions);
}

function makePlotly( state, methane_emission, biomass_generation, CO2_emissions  ){
    var trace1 = {
        x: state,
        y: biomass_generation,
        name: 'Biomass Generation',
        type: 'scatter'
      };
      
      var trace2 = {
        x: state,
        y: methane_emission,
        name: 'Methane Emissions',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      var trace3 = {
        x: state,
        y: CO2_emissions,
        name: 'CO2 Emissions',
        yaxis: 'y3',
        type: 'scatter'
      };

      var data = [trace1, trace2, trace3];
      
      var layout = {
        title: 'Methane VS CO2 levels based off Biomass Generation',
        width: 1200,
        xaxis: {domain: [0.0, 0.8]},
        yaxis: {
          title: 'Biomass Produciton',
          titlefont: {color: '#1f77b4'},
          tickfont: {color: '#1f77b4'}
        },
        yaxis2: {
          title: 'Methane Emissions',
          titlefont: {color: '#ff7f0e'},
          tickfont: {color: '#ff7f0e'},
          anchor: 'free',
          overlaying: 'y',
          side: 'right',
          position: 0.9
        },
        yaxis3: {
          title: 'CO2 Emissions',
          titlefont: {color: '#d62728'},
          tickfont: {color: '#d62728'},
          anchor: 'x',
          overlaying: 'y',
          side: 'right'
        }
      };
      
      Plotly.newPlot('myDiv', data, layout);
Plotly.newPlot('myDiv', data, layout);
};
makeplot();