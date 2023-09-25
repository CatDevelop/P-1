<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$OwnerID = $postData["ownerID"];
	$SchemeName = $postData["schemeName"];

	if(!isset($OwnerID))
		ThrowError($Link, 400, "Введить ID пользователя");

	if(!isset($SchemeName))
		ThrowError($Link, 400, "Введите название схемы!");

	$template = addslashes('{"nodes":[],"edges":[]}');
	$A1 = $Link->query("INSERT INTO `Schemes` (Owner, Name, Scheme) VALUES('$OwnerID', '$SchemeName', '$template')"); 

	$SchemeID = $Link->insert_id;

	if($A1)
		// SendResponse($Link, "Круто!");
		SendResponse($Link, ["message" => "Вы успешно добавили схему!", "schemeID"=>$SchemeID]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>