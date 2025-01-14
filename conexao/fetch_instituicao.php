<?php
include('db.php');
header('Content-Type: application/json');

$response = [];

try {
    // Consulta para contar o número de alunos cadastrados por instituição
    $sql = "SELECT instituicao, COUNT(*) AS registered_count FROM cadastro GROUP BY instituicao";

    // Preparando a consulta
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        // Se falhar ao preparar a consulta
        $response['error'] = 'Erro ao preparar a consulta: ' . $conn->error;
        echo json_encode($response);
        exit;
    }

    // Executando a consulta
    if ($stmt->execute()) {
        $result = $stmt->get_result(); // Obtém o resultado da consulta

        // Verifica se há dados
        if ($result->num_rows > 0) {
            // Armazenando os resultados em um array
            $institutions = [];
            while ($row = $result->fetch_assoc()) {
                $institutions[] = [
                    'nome' => $row['instituicao'],  // Nome da instituição
                    'registered_count' => (int)$row['registered_count']  // Número de alunos cadastrados
                ];
            }

            // Adiciona os dados ao array de resposta
            $response = $institutions;
        } else {
            // Caso não haja resultados
            $response['error'] = 'Nenhuma instituição com alunos cadastrados encontrada.';
        }
    } else {
        // Caso a consulta não seja executada corretamente
        $response['error'] = 'Erro ao executar a consulta no banco de dados: ' . $stmt->error;
    }
} catch (mysqli_sql_exception $e) {
    // Captura erros relacionados ao MySQLi
    $response['error'] = 'Erro ao conectar ou consultar o banco de dados: ' . $e->getMessage();
} catch (Exception $e) {
    // Captura erros gerais
    $response['error'] = 'Erro inesperado: ' . $e->getMessage();
}

// Retorna a resposta como JSON
echo json_encode($response);
?>
