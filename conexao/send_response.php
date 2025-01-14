<?php
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['response'])) {
    $messageId = $data['id'];
    $responseText = $conn->real_escape_string($data['response']);

    $sql = "UPDATE mensagens SET resposta = '$responseText' WHERE id = '$messageId'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Dados incompletos."]);
}

$conn->close();
?>
