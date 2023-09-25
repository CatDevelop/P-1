<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$recordID = GetGet("id");

	if(!isset($recordID))
		ThrowError($Link, 400, "Enter the record ID!");

	$A1 = $Link->query("DELETE FROM `TimeTracking` WHERE `ID`=$recordID"); 

	if($A1)
		SendResponse($Link, "You have successfully delete a time tracking record");
	else
		ThrowError($Link, 500, "Server error! " . mysqli_errno($Link) . " : " . mysqli_error($Link));
?>