<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$noteID = GetGet("id");

	$result = [];
	$seriesName = "";

	$A1 = $Link->query("SELECT * FROM `Notes` WHERE `id`=$noteID LIMIT 1");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc()) 
		{
			if($row["SeriesID"] != "0")
			{
				$A2 = $Link->query("SELECT * FROM `NoteSeries` WHERE `ID`=".($row['SeriesID'])." LIMIT 1");
				$seriesNameRow = $A2->fetch_assoc();
				$seriesName = $seriesNameRow["Name"];
			}

			$result = [
				"id" => $row["id"],
				"ownerID" => $row["OwnerID"],
				"seriesID" => $row["SeriesID"],
				"seriesName" => $seriesName,
				"title" => $row["Name"],
				"blocks" => $row["Notes"],
				"isBlocked" => $row["IsBlocked"]
			];
		}

		SendResponse($Link, $result);
	}
	SendResponse($Link, []);
?>