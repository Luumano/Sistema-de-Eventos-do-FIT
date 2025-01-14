<?php
    header('Content-Type: application/json');
    include('conexao.php');

    // Verificar se a requisição é POST
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obter os dados enviados via POST
        $identificador = $_POST['identificador'];
        $nome = $_POST['nome'];
        $data_nascimento = $_POST['identificador'];
        $curso = $_POST['curso'];
        $instituicao = $_POST['instituicao'];
        $email = $_POST['email'];
        $telefone = $_POST['telefone'];
        $deficiencia = $_POST['deficiencia'];

        // Prepara a consulta SQL para atualizar os dados do usuário
        $sql = "UPDATE cadastro SET nome = ?, data_nascimento = ?, curso = ?, instituicao = ?, email = ?, telefone = ?, deficiencia = ? WHERE identificador = ?";

        // Prepara a consulta
        if($stmt = $conexao->prepare($sql)){
            $stmt->bind_param('ssssssss', $nome, $data_nascimento, $curso, $instituicao, $email, $telefone, $deficiencia, $identificador);

            if($stmt->execute()){
                echo json_encode(['status' => 'success', 'message' => 'Dados atualizados com sucesso']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar os dados']);
            }

            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao preparar a consultar SQL']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Requisição inválida']);
    }

    // Retornar os dados em formato JSON
echo json_encode($registrations);
?><?php
    header('Content-Type: application/json');
    include('conexao.php');

    // Verificar se a requisição é POST
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obter os dados enviados via POST
        $identificador = $_POST['identificador'];
        $nome = $_POST['nome'];
        $data_nascimento = $_POST['identificador'];
        $curso = $_POST['curso'];
        $instituicao = $_POST['instituicao'];
        $email = $_POST['email'];
        $telefone = $_POST['telefone'];
        $deficiencia = $_POST['deficiencia'];

        // Prepara a consulta SQL para atualizar os dados do usuário
        $sql = "UPDATE cadastro SET nome = ?, data_nascimento = ?, curso = ?, instituicao = ?, email = ?, telefone = ?, deficiencia = ? WHERE identificador = ?";

        // Prepara a consulta
        if($stmt = $conexao->prepare($sql)){
            $stmt->bind_param('ssssssss', $nome, $data_nascimento, $curso, $instituicao, $email, $telefone, $deficiencia, $identificador);

            if($stmt->execute()){
                echo json_encode(['status' => 'success', 'message' => 'Dados atualizados com sucesso']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar os dados']);
            }

            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao preparar a consultar SQL']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Requisição inválida']);
    }

    // Retornar os dados em formato JSON
echo json_encode($registrations);
?><?php
    header('Content-Type: application/json');
    include('conexao.php');

    // Verificar se a requisição é POST
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obter os dados enviados via POST
        $identificador = $_POST['identificador'];
        $nome = $_POST['nome'];
        $data_nascimento = $_POST['identificador'];
        $curso = $_POST['curso'];
        $instituicao = $_POST['instituicao'];
        $email = $_POST['email'];
        $telefone = $_POST['telefone'];
        $deficiencia = $_POST['deficiencia'];

        // Prepara a consulta SQL para atualizar os dados do usuário
        $sql = "UPDATE cadastro SET nome = ?, data_nascimento = ?, curso = ?, instituicao = ?, email = ?, telefone = ?, deficiencia = ? WHERE identificador = ?";

        // Prepara a consulta
        if($stmt = $conexao->prepare($sql)){
            $stmt->bind_param('ssssssss', $nome, $data_nascimento, $curso, $instituicao, $email, $telefone, $deficiencia, $identificador);

            if($stmt->execute()){
                echo json_encode(['status' => 'success', 'message' => 'Dados atualizados com sucesso']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar os dados']);
            }

            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao preparar a consultar SQL']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Requisição inválida']);
    }

    // Retornar os dados em formato JSON
echo json_encode($registrations);
?>