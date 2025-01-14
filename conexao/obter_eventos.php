<?php

include 'db.php';

if(isset($_GET['id'])){
    $id = $_GET['id'];

    $sql = "SELECT * FROM eventos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0){
        $evento = $result->fetch_assoc();
        echo json_encode($evento);
    } else {
        echo json_encode(["success" => false, "message" => "Eventos não encontrado."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "ID do evento não fornecido."]);
}

$conn->close();
?>