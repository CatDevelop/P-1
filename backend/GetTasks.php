<?php
	header('Access-Control-Allow-Origin: *');  
	header('Access-Control-Allow-Methods: OPTIONS, GET');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php"; 
	mysqli_set_charset($Link, 'utf8mb4'); 

	$result = [];
	$i = 0;

	$A2 = $Link->query("SELECT * FROM `Tasks` ORDER BY `ID` DESC");
	if ($A2->num_rows > 0)
	{
		while($row = $A2->fetch_assoc()) 
		{
			if($row["Type"] == "task")
			{
				$result[]  = [
					"id" => $row["ID"],
					"categoryID" => (int)$row["CategoryID"],
					"createUserID" => $row["CreateUserID"],
					"type" => "task",
					"name" => $row["Name"],
					"description" => $row["Description"],
					"status" => (int)$row["Status"],
					"priority" => (int)$row["Priority"],
					"responsible" => json_decode($row["Responsible"], false),
					"watchers" => json_decode($row["Watchers"], false),
					"linkedTasksID" => json_decode($row["LinkedTasksID"], false),
					"timeSpent" => json_decode($row["TimeSpent"], false),
					"startDate" => $row["StartDate"],
					"deadlineDate" => $row["DeadlineDate"],
					"createDate" => $row["CreateDate"],
				];
			}

			if($row["Type"] == "subtask")
			{
				$result[]  = [
					"id" => $row["ID"],
					"categoryID" => (int)$row["CategoryID"],
					"mainTaskID" => $row["MainTaskID"],
					"createUserID" => $row["CreateUserID"],
					"type" => "subtask",
					"name" => $row["Name"],
					"description" => $row["Description"],
					"status" => (int)$row["Status"],
					"priority" => (int)$row["Priority"],
					"responsible" => json_decode($row["Responsible"], false),
					"watchers" => json_decode($row["Watchers"], false),
					"linkedTasksID" => json_decode($row["LinkedTasksID"], false),
					"timeSpent" => json_decode($row["TimeSpent"], false),
					"startDate" => $row["StartDate"],
					"deadlineDate" => $row["DeadlineDate"],
					"createDate" => $row["CreateDate"],
				];
			}
			
			$i++;
		}
	}

	SendResponse($Link, ["tasks" => $result]);
?>