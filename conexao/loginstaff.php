<?php
    include 'db.php';

    $password = $_POST['password'];

    // Consulta ao Banco de dados
    $sql = "SELECT * FROM staff WHERE password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Login de responsável bem-sucedido!";
    } else {
        echo "Senha de responsável incorreta.";
    }

    $stmt->close();
    $conn->close();
?>