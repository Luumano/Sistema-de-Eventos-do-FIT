<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$message = $data['message'];

$sql = "INSERT INTO mensagens (user_id, mensagem) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $_SESSION['user_id'], $message);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar mensagem.']);
}

$stmt->close();
$conn->close();
?>