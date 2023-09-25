<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$NoteID = GetGet("noteID");

	if(!isset($NoteID))
		ThrowError($Link, 400, "Введите ID статьи!");

	$A1 = $Link->query("UPDATE `Notes` SET `SeriesID`='0' WHERE `ID`=$NoteID"); 


	if($A1)
		SendResponse($Link, ["message" => "Вы успешно удалили статью из серии!"]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>