<?php
	include "config.php";
	$Link = mysqli_connect($host, $user, $password, $db);

	if (!$Link) 
	{
		echo "Ошибка: Невозможно установить соединение с MySQL.";
		exit;
	}

	function Select($Link, $Column, $db, $Where)
	{
		$A1 = $Link->query("SELECT " . $Column . " FROM " . $db . " WHERE " . $Where);
		$A2 = $A1->fetch_array(MYSQLI_ASSOC);
		$result=$A2[$Column];
		return $result;
	}

	function GetPost($Post)
	{
		if(isset($_POST[$Post])) { $Post = $_POST[$Post]; }
		$Post = mb_convert_encoding($Post, 'windows-1251', mb_detect_encoding($Post));
		$Post = trim($Post);
		$Post = stripslashes($Post);
		return $Post;
	}

	function GetGet($Get)
	{
		if(isset($_GET[$Get])) { $Get = $_GET[$Get]; }
		$Get = mb_convert_encoding($Get, 'windows-1251', mb_detect_encoding($Get));
		$Get = trim($Get);
		$Get = stripslashes($Get);
		return $Get;
	}

	function ThrowError($Link, $HTTPStatus, $ErrorMessage, $isCloseForm=false)
	{
		header('Content-Type: application/json');
		http_response_code($HTTPStatus);
		$error = [
			"status" => $HTTPStatus,
			"error" => $ErrorMessage
		];
		echo json_encode($error);
		mysqli_close($Link);
		exit();
	}

	function SendResponse($Link, $Data)
	{
		header('Content-Type: application/json');
		http_response_code(200);
		$data = [
			"status" => 200,
			"data" => $Data
		];

		echo json_encode($data);
		mysqli_close($Link);
		exit();
	}
?>
