<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-type: application/json');

include 'db.php';

// Buscar registros de ambas as tabelas
$sql = "SELECT identificador, nome, email, evento, hora FROM registros_eventos";

$result = $conn->query($sql);

// Verificar se a consulta foi executada corretamente
if (!$result) {
    die(json_encode(["error" => "Erro na consulta: " . $conn->error]));
}

$registrations = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }
} else {
    echo json_encode(["error" => "Nenhum registro encontrado."]);
    exit;
}

// Retornar os dados em formato JSON
echo json_encode($registrations);

$conn->close();

?>
