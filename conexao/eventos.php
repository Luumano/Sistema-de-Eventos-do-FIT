<?php
    header('Content-Type: application/json');
    include 'db.php';

    $eventos = [];

    $result = $conn->query("SELECT * FROM eventos");
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $eventos[] = $row;
        }
    }

    $conn->close();
    echo json_encode($eventos);
?>