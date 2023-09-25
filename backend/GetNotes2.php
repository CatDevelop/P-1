<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$seriesID = GetGet("seriesID");

	if($seriesID == "seriesID")
		ThrowError($Link, 400, "Введите ID группы!");

	$result = [];
	$i = 0;

	$A2 = $Link->query("SELECT * FROM `NoteSeries` WHERE `SeriesID`=$seriesID ORDER BY `ID` DESC;");
	if ($A2->num_rows > 0)
	{
		while($row = $A2->fetch_assoc()) 
		{
			$result[]  = [
				"id" => $row["ID"],
				"ownerID" => $row["OwnerID"],
				"type" => "group",
				"title" => $row["Name"],
				"image" => $row["Image"],
				"tags" => $row["Tags"],
				"isVisible" => $row["IsVisible"],
				"createDate" => $row["CreateDate"],
			];
			$i++;
		}
	}

	if($seriesID != "0")
	{
		$A3 = $Link->query("SELECT * FROM `NoteSeries` WHERE `ID`=$seriesID LIMIT 1");
		$row = $A3->fetch_assoc();
		$seriesName = $row["Name"];
	}
	

	$A1 = $Link->query("SELECT * FROM `Notes` WHERE `SeriesID`=$seriesID ORDER BY `id` DESC");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc()) 
		{
			$result[]  = [
				"id" => $row["id"],
				"type" => "note",
				"ownerID" => $row["OwnerID"],
				"seriesID" => $row["SeriesID"],
				"title" => $row["Name"],
				"image" => $row["Image"],
				"tags" => $row["Tags"],
				"isVisible" => $row["IsVisible"],
				"isBlocked" => $row["IsBlocked"],
				"createDate" => $row["CreateDate"],
			];
			$i++;
		}
	}
	
	if($seriesID == "0")
		SendResponse($Link, ["notes" => $result]);
	else
		SendResponse($Link, ["notes" => $result, "seriesName" => $seriesName]);
?>