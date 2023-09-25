<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$taskID = $postData["taskID"];
	$type = $postData["type"];
	$value = $postData["value"];

	if(!isset($taskID))
		ThrowError($Link, 400, "Enter the task ID");
	
	if(!isset($type))
		ThrowError($Link, 400, "Enter the type of change");

	if(!isset($value))
		ThrowError($Link, 400, "Enter the value you want to change to");
	
	if (!in_array($type, array("CategoryID", "MainTaskID", "Type", "Name", "Description", "Status", "Priority", "Responsible", "Watchers", "TimeSpent", "StartDate", "DeadlineDate"))) {
		ThrowError($Link, 400, "Invalid type. Acceptable values: CategoryID, MainTaskID, Type, Name, Description, Status, Priority, Responsible, Watchers, TimeSpent, StartDate, DeadlineDate");
	}

	$A1 = $Link->query("UPDATE `Tasks` SET `$type`='$value' WHERE `ID`=$taskID"); 

	if($A1)
		SendResponse($Link, ["message" => "You have successfully changed the task!"]);
	else
		ThrowError($Link, 500, "Server error! " . mysqli_errno($Link) . " : " . mysqli_error($Link));
?>