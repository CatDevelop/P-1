<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php";
	mysqli_set_charset($Link, 'utf8mb4');

	$result = [];
	$i = 0;

	$A1 = $Link->query("SELECT * FROM `Schemes` ORDER BY `ID` DESC");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc())
		{
			$result[]  = [
				"id" => $row["ID"],
				"title" => $row["Name"],
				"ownerId" => $row["Owner"],
				"categoryId" => $row["CategoryID"],
				"scheme" => $row["Scheme"],
				"lastChangeDate" => $row["LastChangeDate"],
				"creationDate" => $row["CreationDate"],
			];
			$i++;
		}

		SendResponse($Link, $result);
	}
	SendResponse($Link, []);
?>
