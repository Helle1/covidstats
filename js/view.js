$(document).ready(function(){
   let view = new covidView();
});


class covidView{
    constructor(props) {
        let self = this;
        this.selectedCountries = ['AT', 'SE', 'DE'];
        this.data = [];
        this.loadInitialDataSet();

        window.addEventListener("resize", function() {

            self.setupBarChart(self.data);
            self.setupLineChart(self.data);

        }, false);

    }

    loadInitialDataSet(){
        this.loadCountries(this.selectedCountries);
    }

    loadCountries(countryCodes){

        let self = this;
        $.ajax({
            url: 'api/data.php',
            type: "get",
            data: {"method": 'get-agregated-relative-data', 'countries':countryCodes.join(",") },
            success: function(response){
                self.data = response;

                self.setupBarChart(response);
                self.setupLineChart(response);

                let sourceDate = response[0].daylieData[response[0].daylieData.length-1].day.date.substr(0,10);
                $('.source-date').text(sourceDate);
                self.initSelectBox();
            },
            error: function(errorData){
                console.log(errorData);
            }
        });
    }

    setupBarChart(data){

        let chartMaker = new googleChartsMaker("Relative Comparision COVID-19 Aggregated Cases today");
        chartMaker.setOutputReference($('#bar-chart'));
        chartMaker.setBarData(data);

        chartMaker.barChart();
    }

    setupLineChart(data){
        let chartMaker = new googleChartsMaker("Relative Comparision COVID-19 Accoumulated Cases per Day");
        chartMaker.setOutputReference($('#line-chart'));
        chartMaker.setLineData(data);

        chartMaker.lineChart();
    }

    initSelectBox() {
        let self = this;

        $('#selected-countries').multiselect({
            nonSelectedText: 'Select multiple countries...',
            enableFiltering: true,
            filterBehavior: 'text',
            enableCaseInsensitiveFiltering: true,
            templates: {
                li: '<li><a href="javascript:void(0);"><label class="pl-2"></label></a></li>',
                filter: '<li class="multiselect-item filter"><div class="input-group m-0 mb-1"><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<div class="input-group-append"><button class="btn btn btn-outline-secondary multiselect-clear-filter" type="button"><i class="fa fa-close"></i></button></div>'
            },
        });

        $.ajax({
            url: 'api/data.php',
            type: "get",
            data: {'method': 'get-countries'},
            success: function (response) {
                self.setupCountrySelectBox(response)
            },
            error: function (errorData) {
                console.log(errorData);
            }

        });
    }

    setupCountrySelectBox(data){
        let self = this;
        let options =  [];

        for(var code in data){
           options.push({
               label: data[code],
               title: data[code],
               value: code,
               selected: ($.inArray(code, this.selectedCountries) >= 0?true:false)
           })
        }
        $('#selected-countries').multiselect('dataprovider', options);

        $('#selected-countries').unbind();
        $('#selected-countries').on('change', function(){
            let countries = $(this).val();
            self.selectedCountries = countries;
            self.loadCountries(countries);
        })
    }
}


