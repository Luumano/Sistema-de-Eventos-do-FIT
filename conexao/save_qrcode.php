<?php
    include 'db.php';
    include 'phpqrcode/qrlib.php';


    $qrCode = $_POST['qrCode'];
    $id = $_POST['id'];
    $eventId = $_POST['eventId'];

    // Processar o QR Code
    $qrCodeData = str_replace('data:image/png;base64,', '', $qrCode);
    $qrCodeData = base64_decode($qrCodeData);
    $fileName = 'qrcode_' . $id . '_' . $eventId . '.png';
    $filePath = 'qrcodes/' .$fileName;

    // Salvar o QR Code em um arquivo
    file_put_contents($filePath, $qrCodeData);

    // Inserir caminho do QR Code no banco de dados
    $sql = "UPDATE registros SET qrcode = ? WHERE id = ? AND evento = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $filePath, $id, $eventId);

    if ($stmt->execute()){
        echo 'success';
    } else {
        echo 'error';
    }

    $stmt->close();
    $conn->close();
?>