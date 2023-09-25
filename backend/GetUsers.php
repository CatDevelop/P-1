<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8'); 

	$result = [];
	$i = 0;

	$A1 = $Link->query("SELECT * FROM `Users`");
	if ($A1->num_rows > 0)
	{
		while($row = $A1->fetch_assoc()) 
		{
			$result[]  = [
				"id" => $row["id"],
				"login" => $row["Login"],
				"firstName" => $row["FirstName"],
				"secondName" => $row["SecondName"],
				"avatar" => $row["AvatarSource"],
			];
			$i++;
		}

		SendResponse($Link, $result);
	}
	SendResponse($Link, []);
?>