<?php

$data = file_get_contents("php://input"); // Get the raw POST data

file_put_contents("todos.json", $data);

echo json_encode(["status" => "success"]); // backend response


if (file_exists("todos.json")) {
    echo file_get_contents("todos.json");
} else {
    echo json_encode(["todolist" => [], "completedList" => []]);
}
?>