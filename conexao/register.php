<?php
include 'db.php';
include 'phpqrcode/qrlib.php'; // Inclua o arquivo qrlib.php corretamente

$id = $_POST['id'];
$nome = $_POST['nome'];
$email = $_POST['email'];
$evento = $_POST['evento'];
$tipo = $_POST['tipo'];

// Gerar o QR Code
$qrText = "ID: $id, Nome: $nome, Email: $email, Evento: $evento, Tipo: $tipo";
$qrFileName = 'qrcode_' . $id . '.png';
$qrFilePath = 'conexao/qrcodes/' . $qrFileName;
QRcode::png($qrText, $qrFilePath, QR_ECLEVEL_L, 4);

// Inserir dados no banco de dados
$sql = "INSERT INTO registros (identificador, tipo_identificador, nome, email, evento) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $id, $tipo, $nome, $email, $evento, $qrFilePath);

if ($stmt->execute()) {
    echo 'success';
} else {
    echo 'error';
}

$stmt->close();
$conn->close();
?>
