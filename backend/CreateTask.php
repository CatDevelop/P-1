<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$TaskName = $postData["taskName"];
	$CreateUserID = $postData["createUserID"];
	$Type = $postData["type"];

	if(!isset($TaskName))
		ThrowError($Link, 400, "Введите название задачи!");

	if(!isset($CreateUserID))
		ThrowError($Link, 400, "Введите ID создателя!");

	if(!isset($Type))
		ThrowError($Link, 400, "Введите тип задачи!");
	

	$A1 = $Link->query("INSERT INTO `Tasks` (CreateUserID, Type, Name, Responsible, Watchers, LinkedTasksID, TimeSpent) VALUES('$CreateUserID', '$Type', '$TaskName', '[]', '[]', '{\"inputTasksID\": [], \"outputTasksID\": []}', '[0, 0]')"); 

	$newTaskID = $Link->insert_id;

	if($A1)
		// SendResponse($Link, "Круто!");
		SendResponse($Link, ["message" => "Вы успешно создали задачу!", "taskID"=>$newTaskID]);
	else
		ThrowError($Link, 500, "Server error! " . mysqli_errno($Link) . " : " . mysqli_error($Link));
?>