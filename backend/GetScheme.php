<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php";
	mysqli_set_charset($Link, 'utf8mb4');

	$schemeID = GetGet("ID");

	$result = [];
	$i = 0;

	$A1 = $Link->query("SELECT * FROM `Schemes` WHERE `ID`=$schemeID LIMIT 1");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc())
		{
			$result  = [
				"id" => $row["ID"],
				"title" => $row["Name"],
				"ownerId" => $row["Owner"],
				"categoryId" => $row["CategoryID"],
				"scheme" => $row["Code"],
				"lastChangeDate" => $row["LastChangeDate"],
				"creationDate" => $row["CreationDate"],
			];
			$i++;
		}

		SendResponse($Link, $result);
	}
	SendResponse($Link, []);
?>
