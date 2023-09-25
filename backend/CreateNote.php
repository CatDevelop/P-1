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
	$NoteName = $postData["noteName"];
	$NoteTags = addslashes($postData["noteTags"]);
	$NoteImage = addslashes($postData["noteImage"]);

	if(!isset($OwnerID))
		ThrowError($Link, 400, "Введить ID пользователя");

	if(!isset($SeriesID))
		ThrowError($Link, 400, "Введите ID категории!");

	if(!isset($NoteName))
		ThrowError($Link, 400, "Введите название статьи!");

	if(!isset($NoteTags))
		ThrowError($Link, 400, "Введите список тегов!");

	if(!isset($NoteImage))
		ThrowError($Link, 400, "Введите ссылку на изображение!");

	$template = addslashes('{"time":1686938937520,"blocks":[],"version":"2.27.0"}');
	$A1 = $Link->query("INSERT INTO `Notes` (OwnerID, SeriesID, Name, Image, Notes, Tags, IsBlocked) VALUES('$OwnerID', '$SeriesID', '$NoteName', '$NoteImage', '$template', '$NoteTags', '0')"); 

	$NoteID = $Link->insert_id;

	if($A1)
		// SendResponse($Link, "Круто!");
		SendResponse($Link, ["message" => "Вы успешно добавили статью!", "noteID"=>$NoteID]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>