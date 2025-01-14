<?php
include 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Verifique se os campos nome e evento estão presentes
if(!isset($data['nome']) || !isset($data['evento'])){
    echo json_encode(["success" => false, "error" => "Campos nome e evento são obrigatórios"]);
    exit;
}

$nome = $data['nome'];
$evento = $data['evento'];
$hora = date('Y-m-d H:i:s');

// Execute a consulta de atualização no banco de dados
$stmt = $conn->prepare("UPDATE registros_eventos SET confirmacao = 'Confirmado', hora = ? WHERE evento = ? AND nome = ? AND confirmacao != 'Confirmado'");
$stmt->bind_param("sss", $hora, $evento, $nome);

if($stmt->execute()){
    if($stmt->affected_rows > 0){
        // Resposta JSON de sucesso
        echo json_encode(['success' => true]);
    } else {
        // Caso não tenha encontrado o registro ou já tenha sido confirmado
        echo json_encode(['success' => false, 'error' => 'Registro não encontrado ou já confirmado']);
    }
} else {
    // Erro ao executar a consulta
    echo json_encode(['success' => false, 'error' => 'Erro na execução da consulta: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>