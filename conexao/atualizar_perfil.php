<?php
    session_start();
    include 'db.php';

    if(!isset($_SESSION['user_id'])){
        echo "Usuário não autenticado.";
        exit;
    }

    $userId = $_SESSION['user_id'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    // Senha opcional
    $senha = !empty($_POST['senha']) ? password_hash($_POST['senha'], PASSWORD_DEFAULT) : null;
    $curso = $_POST['curso'];

    // Atualizar as informações do usuário
    $sql = "UPDATE cadastro SET nome = ?, email = ?, curso = ?" . ($senha ? ", senha = ?" : "") . " WHERE id = ?";
    $stmt = $conn->prepare($sql);

    // Verificar se o prepared statement foi preparado corretamente
    if($stmt === false){
        echo "Erro na consulta SQL.";
        exit;
    }

    if($senha) {
        $stmt->bind_param("ssss", $nome, $email, $curso, $senha, $userId);
    } else {
        $stmt->bind_param("sssi", $nome, $email, $curso, $userId);
    }

    if($stmt->execute()){
        echo "Informações atualizadas com sucesso!";
    } else{
        echo "Erro ao atualizar informações: " . $conn->error;
    }
    
    $stmt->close();
    $conn->close();

    // Redirecionar de volta para o perfil do usuário
    header("Location: https://fit.rf.gd/perfil.html");
    exit();
?>