<?php
header('Content-Type: application/json');
include 'db.php';

// Receber os dados da requisição
$data = json_decode(file_get_contents("php://input"), true);

// Adicionar depuração para verificar se a mensagem foi recebida
error_log("Mensagem recebida: " . print_r($data, true));

if (isset($data['message'])) {
    $messageContent = $conn->real_escape_string($data['message']);
    $sql = "INSERT INTO mensagens (mensagens) VALUES ('$messageContent')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]); // Resposta de sucesso
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]); // Erro na consulta
    }
} else {
    echo json_encode(["success" => false, "error" => "Dados incompletos."]);
}

$conn->close();
?>
