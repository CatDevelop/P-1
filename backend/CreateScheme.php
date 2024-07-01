<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: OPTIONS, POST');
	header("Access-Control-Allow-Headers: Content-Type");
	header('Content-Type: application/json; charset=utf-8');

	include "PinCodeKnowledgeLibrary.php";
	mysqli_set_charset($Link, 'utf8mb4');

	$postData = json_decode(file_get_contents('php://input'), true);

	$OwnerID = $postData["ownerID"];
	$SchemeName = $postData["schemeName"];

	if(!isset($OwnerID))
		ThrowError($Link, 400, "Введить ID пользователя");

	if(!isset($SchemeName))
		ThrowError($Link, 400, "Введите название схемы!");

	$template = addslashes('{"document":{"store":{"document:document":{"gridSize":10,"name":"","meta":{},"id":"document:document","typeName":"document"},"page:page":{"meta":{},"id":"page:page","name":"Page 1","index":"a1","typeName":"page"}},"schema":{"schemaVersion":2,"sequences":{"com.tldraw.store":4,"com.tldraw.asset":1,"com.tldraw.camera":1,"com.tldraw.document":2,"com.tldraw.instance":25,"com.tldraw.instance_page_state":5,"com.tldraw.page":1,"com.tldraw.instance_presence":5,"com.tldraw.pointer":1,"com.tldraw.shape":4,"com.tldraw.asset.bookmark":2,"com.tldraw.asset.image":4,"com.tldraw.asset.video":4,"com.tldraw.shape.group":0,"com.tldraw.shape.text":2,"com.tldraw.shape.bookmark":2,"com.tldraw.shape.draw":2,"com.tldraw.shape.geo":9,"com.tldraw.shape.note":7,"com.tldraw.shape.line":5,"com.tldraw.shape.frame":0,"com.tldraw.shape.arrow":5,"com.tldraw.shape.highlight":1,"com.tldraw.shape.embed":4,"com.tldraw.shape.image":3,"com.tldraw.shape.video":2,"com.tldraw.binding.arrow":0}}},"session":{"version":0,"currentPageId":"page:page","exportBackground":true,"isFocusMode":false,"isDebugMode":true,"isToolLocked":false,"isGridMode":false,"pageStates":[{"pageId":"page:page","camera":{"x":0,"y":0,"z":0.1},"selectedShapeIds":[],"focusedGroupId":null}]}}');
	$A1 = $Link->query("INSERT INTO `Schemes` (Owner, Name, Scheme) VALUES('$OwnerID', '$SchemeName', '$template')");

	$SchemeID = $Link->insert_id;

	if($A1)
		// SendResponse($Link, "Круто!");
		SendResponse($Link, ["message" => "Вы успешно добавили схему!", "schemeID"=>$SchemeID]);
	else
		ThrowError($Link, 500, "Ошибка сервера! Обратитесь к администратору.");
?>
