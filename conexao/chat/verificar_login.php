<?php
    session_start();
    include 'db.php';

    $identificador = $_POST['identificador'];
    $senha = $_POST['senha'];

    $sql = "SELECT * FROM cadastro WHERE identificador = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $identificador);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0){
        $user = $result->fetch_assoc();
        if(password_verify($senha, $row['senha'])){
            $_SESSION['user_id'] = $user['id'];
            echo json_encode(['success' => true]);
        }else{
            echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
        }
    }else{
        echo json_encode(['success' => false, 'message' => 'Identificador não encontrado']);
    }
?>