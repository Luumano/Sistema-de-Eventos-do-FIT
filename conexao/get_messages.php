<?php
header('Content-Type: application/json');
include 'db.php';

$sql = "SELECT id, mensagens FROM mensagens";
$result = $conn->query($sql);

$messages = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

echo json_encode($messages);

$conn->close();
?>
