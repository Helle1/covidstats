<?php

require_once "controller.php";
require_once "curlGateway.php";
require_once "dataModels.php";
require_once "SimpleXLSX.php";
require_once "jsonView.php";
//todo: contribute to: https://github.com/shuchkin/simplexlsx

$controller = new controller();
$uriPath = $_SERVER['REQUEST_URI'];
$controller->route($uriPath);