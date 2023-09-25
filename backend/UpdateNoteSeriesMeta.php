<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$noteSeriesID = $postData["noteSeriesID"];
	$name = $postData["noteSeriesName"];
	$image = addslashes($postData["noteSeriesImage"]);
	$tags = addslashes($postData["noteSeriesTags"]);
	$isVisible = $postData["noteSeriesVisible"];

	if(!isset($noteSeriesID))
		ThrowError($Link, 400, "Введить ID серии статей");

	if(!isset($name))
		ThrowError($Link, 400, "Введить название статьи");

	if(!isset($image))
		ThrowError($Link, 400, "Введить ссылку на изображение");

	if(!isset($tags))
		ThrowError($Link, 400, "Введить список тегов");

	if(!isset($isVisible))
		ThrowError($Link, 400, "Введить видимость статьи");

	$A1 = $Link->query("UPDATE `NoteSeries` SET `Name`='$name', `Image`='$image', `Tags`='$tags', `IsVisible`='$isVisible' WHERE `ID`=$noteSeriesID"); 

	if($A1)
		SendResponse($Link, ["message" => "Вы успешно обновили серию статей!"]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>