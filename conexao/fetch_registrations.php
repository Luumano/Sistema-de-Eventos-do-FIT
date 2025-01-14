<?php
header('Content-Type: application/json');
include 'db.php';

// Verificar conexão com o banco de dados
if ($conn->connect_error) {
    die(json_encode(["error" => "Falha na conexão: " . $conn->connect_error]));
}

// Buscar registros com a contagem de confirmados
$sql = "
    SELECT evento, nome, email, 
           COUNT(*) AS total, 
           SUM(CASE WHEN confirmacao = 'Confirmado' THEN 1 ELSE 0 END) AS confirmed
    FROM registros_eventos
    GROUP BY evento
";

$result = $conn->query($sql);

if (!$result) {
    die(json_encode(["error" => "Erro na consulta: " . $conn->error]));
}

$registrations = array();
while ($row = $result->fetch_assoc()) {
    $registrations[] = $row;
}

echo json_encode($registrations);
$conn->close();
?>
