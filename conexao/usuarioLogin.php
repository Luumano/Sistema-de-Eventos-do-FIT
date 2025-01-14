<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'db.php';

$identificador = $_POST['identificador']; // Pode ser matrícula ou CPF
$password = $_POST['password'];

// Consulta ao banco de dados para obter o hash da senha
$sql = "SELECT * FROM cadastro WHERE identificador = ?";
$stmt = $conn->prepare($sql);

// Verificar se a preparação da consulta foi bem-sucedida
if($stmt === false) {
    // Se hover um erro ao preparar a consulta, exibe uma mensagem genérica e sai
    echo "Erro na consulta. Tente Novamente.";
    exit();
}

$stmt->bind_param("s", $identificador);
$stmt->execute();
$result = $stmt->get_result();

// Verificar se o usuário foi encontrado
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verifica se a senha fornecida corresponde ao hash armazenado
    if (password_verify($password, $user['senha'])) {
        // Iniciar sessão se a senha estiver correta
        $_SESSION['user_id'] = $user['id']; 
        // Armazena o ID do usuário na sessão
        echo "Login de usuário bem-sucedido!";
    } else {
        echo "Senha incorreta.";
    }
} else {
    echo "Matrícula/CPF não encontrados.";
}

$stmt->close();
$conn->close();
?>