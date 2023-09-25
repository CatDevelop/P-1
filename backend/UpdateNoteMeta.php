<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$noteID = $postData["noteID"];
	$ownerID = $postData["ownerID"];
	$name = $postData["noteName"];
	$image = addslashes($postData["noteImage"]);
	$tags = addslashes($postData["noteTags"]);
	$isVisible = $postData["noteVisible"];

	if(!isset($noteID))
		ThrowError($Link, 400, "Введить ID статьи");

	if(!isset($ownerID))
		ThrowError($Link, 400, "Введить ID владельца");

	if(!isset($name))
		ThrowError($Link, 400, "Введить название статьи");

	if(!isset($image))
		ThrowError($Link, 400, "Введить ссылку на изображение");

	if(!isset($tags))
		ThrowError($Link, 400, "Введить список тегов");

	if(!isset($isVisible))
		ThrowError($Link, 400, "Введить видимость статьи");

	$A1 = $Link->query("UPDATE `Notes` SET `OwnerID`=$ownerID, `Name`='$name', `Image`='$image', `Tags`='$tags', `IsVisible`='$isVisible' WHERE `id`=$noteID"); 

	if($A1)
		SendResponse($Link, ["message" => "Вы успешно обновили статью!"]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>