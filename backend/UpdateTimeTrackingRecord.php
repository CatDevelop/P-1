<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$postData = json_decode(file_get_contents('php://input'), true);

	$recordID = $postData["recordID"];
	$type = $postData["type"];
	$value = $postData["value"];

	if(!isset($recordID))
		ThrowError($Link, 400, "Enter the record ID");
	
	if(!isset($type))
		ThrowError($Link, 400, "Enter the type of change");

	if(!isset($value))
		ThrowError($Link, 400, "Enter the value you want to change to");
	
	if (!in_array($type, array("Description", "Time", "Date"))) {
		ThrowError($Link, 400, "Invalid type. Acceptable values: Description, Time, Date");
	}

	$A1 = $Link->query("UPDATE `TimeTracking` SET `$type`='$value' WHERE `ID`=$recordID"); 

	if($A1)
		SendResponse($Link, ["message" => "You have successfully changed the record!"]);
	else
		ThrowError($Link, 500, "Server error! " . mysqli_errno($Link) . " : " . mysqli_error($Link));
?>