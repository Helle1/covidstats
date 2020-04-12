<?php
/**
 * Created by PhpStorm.
 * User: helmuth
 * Date: 12.04.20
 * Time: 09:57
 */

define ("ECDC_URL", "https://www.ecdc.europa.eu/");
define ("ECDC_DATA_URL", "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-");
define ("LOCAL_DATA_FOLDER", dirname(__FILE__)."/../data/");

class curlGateway
{
    /**
     * @var countryDataModel[]
     */
    private $countries;
    /**
     * @var string
     */
    private $curlUrl;
    private $countryCodeCol;

    public function __construct()
    {
        $dataUrl = ECDC_DATA_URL;

        if(date("H") < 12){
            $date = date('Y-m-d',strtotime("-1 days"));
        } else {
            $date = date('Y-m-d');
        }


        $extension = ".xlsx";

        $this->curlUrl = $dataUrl.$date.$extension;
        $this->countryCodeCol = 7;
        $this->countries = [];

        $this->getData($date.$extension);

    }

    private function getData(string $filename){

        if(file_exists(LOCAL_DATA_FOLDER . $filename)){
            error_log("loading data from file ".$filename);

            $fileContent = file_get_contents(LOCAL_DATA_FOLDER.$filename);

        } else {
            error_log("loading data from url ".$filename);
            $fileContent = $this->getCurrentXLSX($filename);
            //todo: if fails, get last known data
        }

        $this->parseData($fileContent);

    }

    private function getCurrentXLSX(string $filename){
        $fileContent = file_get_contents(ECDC_DATA_URL . $filename);
        file_put_contents(LOCAL_DATA_FOLDER . $filename, $fileContent);

        return $fileContent;
    }

    private function parseData(string $fileContent){
        if ( $xlsx = SimpleXLSX::parseData($fileContent) ) {

            $first = true;

            foreach($xlsx->rows() as $row){

                if($first) {
                    $first = false;
                } else {
                    $this->addDaylieEntry($row);
                }
            }

        } else {
            echo SimpleXLSX::parse_error();
        }
    }

    private function addDaylieEntry(array $row){

        $this->createCountryModelIfNotExists($row);

        $newCases = $row[4];
        $deathCases = $row[5];

        $daylieEntry = new daylieData();
        $daylieEntry->day = new DateTime( $row[3]."-".$row[2] ."-". $row[1] );
        $daylieEntry->newCases = $newCases;
        $daylieEntry->deathCases = $deathCases;

        $this->countries[$row[$this->countryCodeCol]]->daylieData[] = $daylieEntry;
        $this->updateAggregatedValues($row);

    }

    private function updateAggregatedValues($row){
        $newCases = $row[4];
        $deathCases = $row[5];

        $this->countries[$row[$this->countryCodeCol]]->aggregatedCases += $newCases;
        $this->countries[$row[$this->countryCodeCol]]->aggregatedDeaths += $deathCases;

        $aggregatedCases = $this->countries[$row[$this->countryCodeCol]]->aggregatedCases;
        $aggregatedDeaths = $this->countries[$row[$this->countryCodeCol]]->aggregatedDeaths;

        $population = $this->countries[$row[$this->countryCodeCol]]->population;

        if($population > 0){

            $relativeCases = $aggregatedCases / $population;
            $relativeDeaths = $aggregatedDeaths  / $population;

            $this->countries[$row[$this->countryCodeCol]]->relativeCases = $relativeCases;
            $this->countries[$row[$this->countryCodeCol]]->relativeDeaths = $relativeDeaths;
            if($aggregatedCases > 0) {
                $this->countries[$row[$this->countryCodeCol]]->deathRate = $aggregatedDeaths / $aggregatedCases;
            }  else {
                $this->countries[$row[$this->countryCodeCol]]->deathRate = 0;
            }
        }

    }

    private function createCountryModelIfNotExists(array $row){

        $countryCode = $row[$this->countryCodeCol];

        if( ! isset($this->countries[$countryCode])){
            $this->countries[$countryCode] = $this->createCountryModel($row);
        }
    }

    private function createCountryModel(array $row){
        $countryModel = new countryDataModel();

        $countryModel->countryCode = $row[$this->countryCodeCol];
        $countryModel->countryName = $row[6];
        $countryModel->population = $row[9];
        $countryModel->daylieData = [];
        $countryModel->aggregatedCases = 0;
        $countryModel->aggregatedDeaths = 0;
        $countryModel->relativeCases = 0;
        $countryModel->relativeDeaths = 0;
        $countryModel->dataSource = ECDC_URL;

        return $countryModel;
    }

    public function getAllData(){
        return $this->countries;
    }

    public function getCountryData(string $countryCode){

        if( isset($this->countries[$countryCode])){

            $daylieEntries = $this->countries[$countryCode]->daylieData;
            $this->countries[$countryCode]->daylieData = array_reverse ( $daylieEntries );

            return $this->countries[$countryCode];
        } else {
            return false;
        }
    }

    public function getCountryListData(array $countryCodes){

        $countries = [];

        $i=0;
        foreach($countryCodes as $countryCode){
            $countries[$i] = $this->getCountryData($countryCode);
            $i++;
        }

        return $countries;
    }

    public function getCountryList(){
        $jsonCountryCodes = file_get_contents(LOCAL_DATA_FOLDER . "twoLetterCodes.json");
        return json_decode( $jsonCountryCodes );
    }

}