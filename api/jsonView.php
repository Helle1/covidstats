<?php
/**
 * Created by PhpStorm.
 * User: helmuth
 * Date: 12.04.20
 * Time: 10:15
 */

class jsonView
{

    public function __construct()
    {
        header( 'Content-Type: application/json' );
    }

    public function streamOutput($dataObject){

        $json = json_encode($dataObject);
        echo $json;

    }

}