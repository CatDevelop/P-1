<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$noteSeriesID = GetGet("noteSeriesID");

	if(!isset($noteSeriesID))
		ThrowError($Link, 400, "Введите ID серии статей!");

	$A1 = $Link->query("UPDATE `Notes` SET `SeriesID`=0 WHERE `SeriesID`=$noteSeriesID"); 

    $A2 = $Link->query("DELETE FROM `NoteSeries` WHERE `ID`=$noteSeriesID"); 

	if($A1 && $A2)
		SendResponse($Link, ["message" => "Вы успешно удалили серию статей!"]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>