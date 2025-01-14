<?php
    session_start();
    include 'db.php';

    // Verificar se o usuário está autenticado
    if(!isset($_SESSION['user_id'])){
        echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
        exit;
    }

    //Obter o ID do usuário da sessão
    $userId = $_SESSION['user_id'];

    // Consultar os dados do usuário no banco de dados
    $sql = "SELECT nome, email, curso FROM cadastro WHERE id = ?";
    $stmt = $conn->prepare($sql);

    // Verificar se o prepared statement foi preparado corretamente
    if($stmt === false){
        echo json_encode(['success' => false, 'message' => 'Erro na consulta SQL']);
        exit;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar se o usuário foi encontrado
    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    }

    $stmt->close();
    $conn->close();

?>