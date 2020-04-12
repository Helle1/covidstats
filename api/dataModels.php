<?php
/**
 * Created by PhpStorm.
 * User: helmuth
 * Date: 12.04.20
 * Time: 09:48
 */

class countryDataModel
{
    /**
     * @var string
     */
    public $countryCode;
    /**
     * @var string
     */
    public $countryName;
    /**
     * @var integer
     */
    public $population;
    /**
     * @var array
     */
    public $daylieData;
    /**
     * @var integer
     */
    public $aggregatedCases;
    /**
     * @var integer
     */
    public $aggregatedDeaths;

    /**
     * @var float
     */
    public $relativeCases;
    /**
     * @var float
     */
    public $relativeDeaths;
    /**
     * @var float
     */
    public $deathRate;
    /**
     * @var string
     */
    public $dataSource;

}

class daylieData{
    /**
     * @var DateTime
     */
    public $day;
    /**
     * @var integer
     */
    public $newCases;
    /**
     * @var integer
     */
    public $deathCases;
}