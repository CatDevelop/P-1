<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$OwnerID = $postData["ownerID"];
	$SeriesID = $postData["seriesID"];
	$SeriesName = $postData["seriesName"];
	$SeriesTags = addslashes($postData["seriesTags"]);
	$SeriesImage = addslashes($postData["seriesImage"]);
	$SeriesExportNotes = addslashes($postData["seriesExportNotes"]);

	if(!isset($OwnerID))
		ThrowError($Link, 400, "Введите ID владельца!");

	if(!isset($SeriesID))
		ThrowError($Link, 400, "Введите ID серии!");

	if(!isset($SeriesName))
		ThrowError($Link, 400, "Введите название серии!");

	if(!isset($SeriesTags))
		ThrowError($Link, 400, "Введите список тегов!");

	if(!isset($SeriesImage))
		ThrowError($Link, 400, "Введите ссылку на изображение!");

	if(!isset($SeriesExportNotes))
		ThrowError($Link, 400, "Введите список статей!");

	$A1 = $Link->query("INSERT INTO `NoteSeries` (OwnerID, SeriesID, Name, Image, Tags) VALUES('$OwnerID', '$SeriesID', '$SeriesName', '$SeriesImage', '$SeriesTags')"); 

	$newSeriesID = $Link->insert_id;

	if($SeriesExportNotes != "")
		$A2 = $Link->query("UPDATE `Notes` SET `SeriesID`='$newSeriesID' WHERE `ID` IN ($SeriesExportNotes)"); 
	else
		$A2 = true;
	
	if($A1 && $A2)
		// SendResponse($Link, "Круто!");
		SendResponse($Link, ["message" => "Вы успешно добавили серию статей!", "seriesID"=>$newSeriesID]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>