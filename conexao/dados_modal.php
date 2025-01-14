<?php
    session_start();

    // Verificar se o usuário está logado
    if(!isset($_SESSION['user_id'])){
        // Se não estiver logado, retorna um erro
        http_response_code(401); // Código 401 - Unauthorized
        echo json_encode(['error' => 'Usuário não está logado']);
        exit;
    }
    include 'db.php';

    // Obter o ID do usuário logado da sessão
    $userId = $_SESSION['user_id'];

    // Prepara a consulta SQL para buscar os dados do usuário
    $sql = "SELECT identificador, nome, curso, instituicao, email, telefone FROM cadastro WHERE id = ?";

    // Executa a consulta
    if($stmt = $conn->prepare($sql)){
        $stmt->bind_param('i', $userId);
        $stmt->execute();

        //Obtém o resultado da consulta
        $result = $stmt->get_result();

        if($result->num_rows > 0){
            // Converter o resultado em um array associativo
            $userData = $result->fetch_assoc();

            // Define o tipo de conteúdo como JSON
            header('Content-Type: application/json');

            // Retorna os dados do usuário em formato JSON
            echo json_encode($userData);
        } else {
            // Se não encontrar o usuário, retornar um erro
            http_response_code(404); // Código 404 - Not Found
            echo json_encode(['error' => 'Usuário não encontrado']);
        }

        $stmt->close();
    } else {
        // Caso a consulta falhe
        http_response_code(500); // Código 500 - Internal Server Error
        echo json_encode(['error' => 'Erro na consulta ao banco de dados']);
    }

    $conn->close();
?>
