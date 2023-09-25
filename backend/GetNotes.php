<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$result = [];
	$i = 0;

	$A1 = $Link->query("SELECT * FROM `Notes`");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc()) 
		{
			$result[]  = [
				"id" => $row["id"],
				"title" => $row["Name"],
				"key" => "0-" . $i,
				// "notes" => $row["Notes"],
				"isBlocked" => $row["IsBlocked"],
				"isLeaf" => true
			];
			$i++;
		}

		SendResponse($Link, ["key" => "0", "title" => "Сетевое хранилище", "children" => $result]);
	}
	SendResponse($Link, []);
?>