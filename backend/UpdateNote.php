<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$noteID = $postData["noteID"];
	$Note = $postData["note"];
	
	if(!isset($noteID))
		ThrowError($Link, 400, "Введить ID статьи");

	if(!isset($Note))
		ThrowError($Link, 400, "Нет полей для изменений!");

	$A1 = $Link->query("UPDATE `Notes` SET `Notes`='".addslashes($Note)."' WHERE `id`=$noteID"); 

	if($A1)
		SendResponse($Link, ["message" => "Вы успешно изменили статью!"]);
	else
		ThrowError($Link, 500, "Не удалось обновить статью!");
?>