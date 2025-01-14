<?php
// Ativar exibição de erros para depuração
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';  // Inclua sua conexão com o banco de dados

// Receber dados do POST
$data = json_decode(file_get_contents('php://input'), true);
$nome = $data['nome'];  // Nome do usuário
$identificador = $data['identificador'];  // Identificador (matrícula ou CPF)
$novaSenha = $data['novaSenha'];  // Nova senha fornecida pelo usuário

// Validar os dados
if (empty($nome) || empty($identificador) || empty($novaSenha)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, informe o nome, o identificador e a nova senha']);
    exit;
}

// Gerar o hash da nova senha usando bcrypt
$novaSenhaHash = password_hash($novaSenha, PASSWORD_BCRYPT);

// Preparar a consulta para verificar o usuário no banco de dados
$sql = "SELECT * FROM cadastro WHERE nome = ? AND identificador = ?";
$stmt = $conn->prepare($sql);

// Verificar se a consulta foi preparada corretamente
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta']);
    exit;
}

// Vincular o parâmetro (nome e identificador) ao placeholder (?)
$stmt->bind_param('ss', $nome, $identificador);

// Executar a consulta
$stmt->execute();

// Verificar se o usuário foi encontrado
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    // Preparar a consulta para atualizar a senha no banco de dados
    $sqlUpdate = "UPDATE cadastro SET senha = ? WHERE nome = ? AND identificador = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    
    if ($stmtUpdate === false) {
        echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta para atualização de senha']);
        exit;
    }

    // Vincular os parâmetros para a atualização da senha
    $stmtUpdate->bind_param('sss', $novaSenhaHash, $nome, $identificador);

    // Executar a consulta de atualização
    $stmtUpdate->execute();

    // Verificar se a atualização foi bem-sucedida
    if ($stmtUpdate->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Senha alterada com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao alterar a senha']);
    }

    // Fechar a declaração de atualização
    $stmtUpdate->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
}

// Fechar a declaração e a conexão
$stmt->close();
$conn->close();


?>