<?php
/**
 * Created by PhpStorm.
 * User: helmuth
 * Date: 12.04.20
 * Time: 10:52
 */

class controller
{
    private $dataGateway;

    public function __construct()
    {
        $this->dataGateway = new curlGateway();
    }

    public function route(string $path){

        $route = $this->getRout($path);

        switch($route){
            case 'get-agregated-relative-data':
                $this->getAggregatedRelativeDataOfAllCountries();
                break;
            case 'get-daylie-country-absolut-data':
                $this->getAllDaylieDataFromCoutnry();
                break;
            case 'get-countries':
                $this->getCountries();
                break;
        }
    }

    private function getRout(string $uri){

        $route = filter_input(INPUT_GET, "method", FILTER_SANITIZE_STRING);
        return $route;
        /*
        $parts = explode("?", $uri);
        $route = trim($parts[0], "/");

        return $route;*/
    }

    public function getAllDaylieDataFromCoutnry(){
        $countryCode = filter_input(INPUT_GET, "code", FILTER_SANITIZE_STRING);
        $result = $this->dataGateway->getCountryData($countryCode);

        $output = new jsonView();
        $output->streamOutput($result);

    }

    public function getAggregatedRelativeDataOfAllCountries(){

        $countryList = filter_input( INPUT_GET, "countries", FILTER_SANITIZE_STRING);
        $countryCodes = explode(",",$countryList);

        $result = $this->dataGateway->getCountryListData($countryCodes);

        $output = new jsonView();
        $output->streamOutput($result);
    }

    public function getCountries(){
        $result = $this->dataGateway->getCountryList();

        $output = new jsonView();
        $output->streamOutput($result);
    }

}