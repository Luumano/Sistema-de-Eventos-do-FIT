<?php
// Conexão com o banco de dados
include 'db.php';

$query = "SELECT identificador, nome, email, evento, confirmado, hora FROM registros_eventos";
$result = mysqli_query($conn, $query);

$registrations = [];
while($row = mysqli_fetch_assoc($result)) {
    $registrations[] = $row;
}

echo json_encode($registrations);
?>
