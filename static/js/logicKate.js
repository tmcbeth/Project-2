// function makeplot() {
//     d3.csv("data/raw_data/Final_CO2_Emissions.csv", function(data){
//         processData(data)});
// };
 
// function processData(allRows) {
 
//     // console.log(allRows);
//     var Ann_Heat_Input_1996 = [], Ann_Heat_Input_2016 = [], Ann_CO2_Rate_1996 = [], Ann_CO2_Rate_2016 = [], CO2_Emissions_1996 = [], CO2_Emissions_2016 = [], State = [], CO2_Difference = [];
 
//     for (var i=0; i<allRows.length; i++) {
//         row = allRows[i];
//         Ann_Heat_Input_1996.push(row['Ann_Heat_Input_1996']);
//         Ann_Heat_Input_2016.push(row['Ann_Heat_Input_2016']);
//         Ann_CO2_Rate_1996.push(row['Ann_CO2_Rate_1996']);
//         Ann_CO2_Rate_2016.push(row['Ann_CO2_Rate_2016']);
//         CO2_Emissions_1996.push(row['CO2_Emissions_1996']);
//         CO2_Emissions_2016.push(row['CO2_Emissions_2016']);
//         CO2_Difference.push(row['CO2_Difference']);
//         State.push(row['State']);
//     }
//     console.log('a',Ann_Heat_Input_1996, 'b',Ann_Heat_Input_2016, 'c',Ann_CO2_Rate_1996, 'd',Ann_CO2_Rate_2016, 'e',CO2_Emissions_1996, 'f',CO2_Emissions_2016, 'g',CO2_Difference, 'h',State);

//     makePlotly1(CO2_Difference, State);
//     makePlotly2(Ann_Heat_Input_1996, Ann_Heat_Input_2016, Ann_CO2_Rate_1996, Ann_CO2_Rate_2016, CO2_Emissions_1996, CO2_Emissions_2016);
// };
console.log("run kate js");
function makePlotly1() {
    
    var chartUrl = `/co2_comparison`;
    d3.json(chartUrl).then(function (response) {
        var State = response.State;
        var CO2_Difference = response.CO2_Difference;

        console.log("Kate1", State);
        console.log("Kate1", CO2_Difference);

        // var plotDiv = document.getElementById("Kate1");
        var traces = [{
            x: State,
            y: CO2_Difference,
            type: 'bar'
        }];
    
        var data = [traces];
    
        var layout = {
            title: "Difference in CO2 Emissions (1996 vs. 2016)"
        };
 
        Plotly.newPlot('Kate1', traces,
            { title: 'Difference in CO2 Emissions (1996 vs. 2016)' });
    });
}

makePlotly1();

 
function makePlotly2() {
    var chartUrl = `/co2_comparison`;
    d3.json(chartUrl).then(function (response) {

        // var plotDiv = document.getElementById("Kate2");

        var trace1 = {
            x: ['Avg_Ann_Heat_Input', 'Avg_Ann_CO2_Rate', 'Avg_CO2_Emissions'],
            y: [461173748.6960785 / 1000000, 1467.0758823529404, 2291060309 / 1000000],
            name: '1996',
            type: 'bar'
        };
          
        var trace2 = {
            x: ['Avg_Ann_Heat_Input', 'Avg_Ann_CO2_Rate', 'Avg_CO2_Emissions'],
            y: [748714312.0784314 / 1000000, 990.5294117647059, 2034489329 / 1000000],
            name: '2016',
            type: 'bar'
        };
          
        var data = [trace1, trace2];
          
        var layout = {
            barmode: 'group',
            title: "Changes Over Time (1996 vs. 2016)"
        };
          
        Plotly.newPlot('Kate2', data, layout);
    });
}

makePlotly2();