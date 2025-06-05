<?php
if (file_exists("todos.json")) {
    echo file_get_contents("todos.json");
} else {
    echo json_encode(["todolist" => [], "completedList" => []]);
}
?>