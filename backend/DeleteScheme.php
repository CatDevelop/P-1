<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$SchemeID = GetGet("schemeID");

	if(!isset($SchemeID))
		ThrowError($Link, 400, "Введите ID схемы!");

    $A1 = $Link->query("DELETE FROM `Schemes` WHERE `ID`=$SchemeID"); 

	if($A1)
		SendResponse($Link, ["message" => "Вы успешно удалили схему!"]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>