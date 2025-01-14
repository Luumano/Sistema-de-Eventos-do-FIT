<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include 'db.php';

        $identificador = $_POST['identificador'] ?? '';
        $tipo_identificador = $_POST['tipo_identificador'] ?? '';
        $nome = $_POST['nome'] ?? '';
        $email = $_POST['email'] ?? '';
        $senha = password_hash($_POST['senha'] ?? '', PASSWORD_DEFAULT);
        $curso = $_POST['curso'] ?? '';
        $instituicao = $_POST['instituicao'] ?? '';
        $telefone = $_POST['telefone'] ?? '';

    // Verificar se o identificador já está cadastrado
    $checkIdentificadorSql = "SELECT COUNT(*) FROM cadastro WHERE identificador = ?";
    $stmtCheckIdentificador = $conn->prepare($checkIdentificadorSql);
    $stmtCheckIdentificador->bind_param("s", $identificador);
    $stmtCheckIdentificador->execute();
    $stmtCheckIdentificador->bind_result($identificadorCount);
    $stmtCheckIdentificador->fetch();
    $stmtCheckIdentificador->close();

    if ($identificadorCount > 0) {
        // Se o identificador já estiver cadastrado, retorna um erro
        $response = [
            'success' => false,
            'message' => 'Matricula ou CPF está cadastrado no sistema'
        ];
    } else {
        // Se o identificador não existir, realiza o cadastro
        $sql = "INSERT INTO cadastro (identificador, tipo_identificador, nome, email, senha, curso, telefone, instituicao) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssss", $identificador, $tipo_identificador, $nome, $email, $senha, $curso, $telefone, $instituicao);

        if ($stmt->execute()) {
            $response = [
                'success' => true,
                'message' => "Cadastro realizado com sucesso!"
            ];
        } else {
            $response = [
                'success' => false,
                'message' => "Erro ao realizar o cadastro: " . $stmt->error
            ];
        }

        $stmt->close();
    }

    $conn->close();
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
?>
