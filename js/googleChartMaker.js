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
            colors: ['#bed232', '#f5a500', '#78826e', '#496442', '#000000', '#0A2039'],
            dataOpacity: 0.9
        };

        return barChartOptions;
    }

    setOutputReference(outputReference){
        this.outputReference = outputReference;
    }

    setBarData(data){

        this.data = [[
            {label: 'Country', type: 'string'},
            {label: 'Relative Cases', type: 'number'},
            {type: 'string', role: 'tooltip','p': {'html': true} },
            {label: 'Relative Death', type: 'number'},
            {type: 'string', role: 'tooltip','p': {'html': true} },
            {label: 'Deathrate', type: 'number'},
            {type: 'string', role: 'tooltip','p': {'html': true} }
        ]];//, 'Durchschnitt']];

        let average = this.getAverage(data);
        for(let i=0;i<data.length; i++){

            this.data.push([
                data[i].countryName,
                data[i].relativeCases*100,
                "<b>"+data[i].countryName+"</b><br> - CASES: "+Math.round(data[i].relativeCases*1000000) /10000 +"% <br /> (Absolut: "+data[i].aggregatedCases+" [Pop. "+data[i].population+")",
                data[i].relativeDeaths*100,
                "<b>"+data[i].countryName+"</b><br> - DEATHS: "+Math.round(data[i].relativeDeaths*1000000) / 10000+"% <br /> (Absolut: "+data[i].aggregatedDeaths+" [Pop. "+data[i].population+")",
                data[i].deathRate*100,
                "<b>"+data[i].countryName+"</b><br>  - DEATHSRATE: "+Math.round(data[i].deathRate*1000000)/10000+"%"
            ]);
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

        let data = google.visualization.arrayToDataTable(this.data);
        let options = {
            chart: {
                title: this.title,
            },
            tooltip: {isHtml: true},
            legend: {position: 'top'},
            hAxis: {
                0: {
                    format: '#.000\'%\'',
                    title: "Relative Cases",
                    textPosition: 'out',
                }
            },
            orientation: 'vertical',
            series: {
                0: {
                    targetAxisIndex: 0
                },
                1: {
                    targetAxisIndex: 0
                },
                2: {
                    targetAxisIndex: 1
                }
            },
            seriesType: 'bars',

        };

        options = Object.assign(options, this.chartOptions);
        $(this.outputReference[0]).css('height', (100 + 80*this.data.length)+"px");
        var chart = new google.visualization.ComboChart(this.outputReference[0]);
        chart.draw(data, options);
    }

    setLineData(data){
        this.data = [];

        let header = [{label: 'Day', type: 'date'}];
        let accumulations = [];
        for(let i=0;i<data.length; i++){
            header.push({label: data[i].countryName, type: 'number'});
            accumulations[i] = 0;
        }
        this.data.push(header);

        let series = [];
        for(let i=0;i<data.length; i++){

            for(let j in data[i].daylieData){

                let dateString = data[i].daylieData[j].day.date.substr(0,10);
                if(typeof (series[dateString]) == "undefined"){
                    let currentDate = new Date(data[i].daylieData[j].day.date.substr(0,10));
                    series[dateString] = [currentDate];
                }

                let relativeCases = (data[i].daylieData[j].newCases + accumulations[i]) / data[i].population;

                accumulations[i] += data[i].daylieData[j].newCases;
                series[dateString][i+1] = relativeCases * 100;
            }
        }

        for(let x in series){
            this.data.push(series[x]);
        }

    }

    lineChart(){
        let self = this;

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(function(){self.drawLineChart(); });
    }

    drawLineChart(){
        let data = google.visualization.arrayToDataTable(this.data);
        let options = {
            chart: {
                title: this.title,
            },
            animation: {
                startup: true,
                duration: 1200,
                easing: 'inAndOut'
            },
          /*  hAxis: {
                direction: -1
            },*/
            legend: {position: 'top'},
            curveType: 'function',
        };

        var formatter = new google.visualization.NumberFormat({
            fractionDigits: 4,
            suffix: '%'
        });
        formatter.format(data, 1);
        formatter.format(data, 2);
        formatter.format(data, 3);

        //todo:view-source:https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/controls_d3ec93155bc4de1d1a6e0a7d4993184e817bc4f8d5256d6b0fa4b029f00ccd9a.frame?hl=de

        options = Object.assign(options, this.chartOptions);
        //$(this.outputReference[0]).css('height', (200 + 100*this.data.length)+"px");
        var chart = new google.visualization.LineChart(this.outputReference[0]);
        chart.draw(data, options);
    }
}