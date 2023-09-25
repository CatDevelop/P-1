<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$TaskID = $postData["taskID"];
	$CreateUserID = $postData["createUserID"];
	$Description = $postData["description"];
	$Time = $postData["time"];
	$Date = $postData["date"];

	if(!isset($TaskID))
		ThrowError($Link, 400, "Enter the task ID!");

	if(!isset($CreateUserID))
		ThrowError($Link, 400, "Enter the user ID!");

	if(!isset($Description))
		ThrowError($Link, 400, "Enter the description of time tracking!");
	
	if(!isset($Time))
		ThrowError($Link, 400, "Enter the number of minutes!");
	
	if(!isset($Date))
		ThrowError($Link, 400, "Enter the date!");
	
	$NewDate = date("Y-m-d H:i:s", strtotime('+3 hours', strtotime($Date)));
	
	$A1 = $Link->query("INSERT INTO `TimeTracking` (TaskID, OwnerID, Description, Time, Date) VALUES('$TaskID', '$CreateUserID', '$Description', '$Time', '$NewDate')"); 

	if($A1)
		SendResponse($Link, "You have successfully created a time tracking record");
	else
		ThrowError($Link, 500, "Server error! " . mysqli_errno($Link) . " : " . mysqli_error($Link));
?>