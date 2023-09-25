<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8');
	
	$taskID = GetGet("taskID");

	$result = [];
	$i = 0;

	$A1 = $Link->query("SELECT * FROM `TimeTracking` WHERE `TaskID`=$taskID ORDER BY `ID` DESC");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc()) 
		{
			$result[]  = [
				"id" => $row["ID"],
				"ownerID" => $row["OwnerID"],
				"description" => $row["Description"],
				"time" => (int)$row["Time"],
				"date" => $row["Date"],
			];
			$i++;
		}

		SendResponse($Link, $result);
	}
	SendResponse($Link, []);
?>