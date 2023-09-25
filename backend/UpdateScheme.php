<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php";
	mysqli_set_charset($Link, 'utf8mb4');

	$postData = json_decode(file_get_contents('php://input'), true);

	$schemeID = $postData["schemeID"];
	$scheme = $postData["scheme"];


	if(empty($schemeID))
		ThrowError($Link, 400, "Введить ID схемы");

	if(empty($scheme))
		ThrowError($Link, 400, "Вы ввели не всю информацию, заполните все поля!");

	$A1 = $Link->query("UPDATE `Schemes` SET `Code`='".addslashes($scheme)."' WHERE `ID`=$schemeID");

	if($A1)
		SendResponse($Link, ["message" => "Вы успешно обновили схему!"]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>
