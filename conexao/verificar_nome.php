<?php
// Ativar exibição de erros para depuração
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

// Receber dados do POST
$data = json_decode(file_get_contents('php://input'), true);
$nome = $data['nome'];

// Validar os dados
if (empty($nome)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, informe o nome completo']);
    exit;
}

// Preparar a consulta para verificar se o nome existe no banco de dados
$sql = "SELECT id FROM cadastro WHERE nome = ?";
$stmt = $conn->prepare($sql);

// Verificar se a consulta foi preparada corretamente
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta']);
    exit;
}

// Vincular o parâmetro (nome) ao placeholder (?)
$stmt->bind_param('s', $nome); // 's' indica que o parâmetro é uma string

// Executar a consulta
$stmt->execute();

// Obter o resultado
$stmt->store_result();

// Verificar se o nome foi encontrado
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Usuário encontrado']);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
}

// Fechar a declaração e a conexão
$stmt->close();
$conn->close();
?>
