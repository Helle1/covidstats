class googleChartsMaker{

    constructor(title) {

        //todo: catch if already loaded
//        $.getScript("https://www.gstatic.com/charts/loader.js");

        this.title = title;
        this.chartOptions = this.getOptions();
    }

    //TODO: biss aufräumen und die reihenfolge checken

    getOptions(){
        let barChartOptions = {
            animation: {
                startup: true,
                duration: 1200,
                easing: 'inAndOut'
            },
            colors: ['#FF3E17', '#B0FF24', '#FF096E', '#24FFAA', '#CA17FF'],
            dataOpacity: 0.9
        };

        return barChartOptions;
    }

    setOutputReference(outputReference){
        this.outputReference = outputReference;
    }

    setData(data){

        this.data = [];//, 'Durchschnitt']];
        let average = this.getAverage(data);
        for(let i=0;i<data.length; i++){

            let descriptionText = "absolut cases/death (population): "+data[i].aggregatedCases+"/"+data[i].aggregatedDeaths + "("+data[i].population+")";
            this.data.push([data[i].countryName, data[i].relativeCases*100, data[i].relativeDeaths*100, data[i].deathRate*100, descriptionText]);
        }
    }

    barChart(){
        let self = this;

        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(function(){self.drawBarChart(); });
    }

    getAverage(data){

        let count = 0;
        for(let i=0;i<data.length; i++){

            count += data[i].aggregatedCases;
        }

        return count / data.length;
    }


    drawBarChart(){

        let data = new google.visualization.DataTable();

        data.addColumn( {label: 'Country', type: 'string'} );
        data.addColumn( {label: 'Relative Cases', type: 'number'} );
        data.addColumn( {label: 'Relative Death', type: 'number'} );
        data.addColumn( {label: 'Deathrate', type: 'number'} );
        data.addColumn( {type: 'string', role: 'tooltip' } );

        data.addRows(this.data);
        let options = {
            chart: {
                title: this.title,
            },
            chartArea: {width: '100%'},
            legend: {position: 'top'},

            hAxis: {
                format: '#.000\'%\'',
            },
            bars: 'horizontal',
            series: {
                0: { axis: 'cases' },
                1: { axis: 'cases' },
                2: { axis: 'deathrate'}
            },
            axes: {
                x: {
                    cases: {side: 'bottom', label: '% cases', }, // Bottom x-axis.
                    deathrate: {side: 'top', label: '% Deathrate'} // Top x-axis.
                }
            }
        };

        options = Object.assign(options, this.chartOptions);

        let chart = new google.charts.Bar(this.outputReference[0]);

        $(this.outputReference[0]).css('height', (100 + 100*this.data.length)+"px");

        chart.draw(data, google.charts.Bar.convertOptions(options));

    }
}