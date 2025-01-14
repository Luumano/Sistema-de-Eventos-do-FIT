<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    session_start();
    include 'db.php';

    // Verifica se o ID do usuário está definido na sessão
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "Usuário não autenticado."]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    
    // Consulta para obter as informações do usuário
    $sql = "SELECT nome, email, curso, instituicao, identificador FROM cadastro WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die(json_encode(["error" => "Erro na preparação da consulta: " . htmlspecialchars($conn->error)]));
    }
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    if ($data) {
        // Consulta para obter os eventos do usuário e os QR Codes
        $sql = "SELECT e.nome, e.evento, e.hora, e.qr_code AS qrcode FROM registros_eventos e 
                JOIN cadastro c ON c.identificador = e.identificador WHERE c.id = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            die(json_encode(["error" => "Erro na preparação da consulta: " . htmlspecialchars($conn->error)]));
        }
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $events = [];
        while ($row = $result->fetch_assoc()) {
            // Corrige o caminho do QR Code, removendo duplicações, se necessário
            $qrcodePath = $row['qrcode'];

            // Verifica se o caminho já inclui "conexao/qrcodes/", caso contrário, adiciona
            if (strpos($qrcodePath, 'conexao/') !== 0) {
                // Se não tiver o caminho correto, adiciona a pasta "conexao/qrcodes/"
                $qrcodePath = 'conexao/' . ltrim($qrcodePath, '/');
            }

            // Atribui o caminho corrigido ao QR code
            $row['qrcode'] = $qrcodePath;

            // Adiciona o evento ao array de eventos
            $events[] = $row;
        }

        // Adiciona os eventos ao array de dados do usuário
        $data['events'] = $events;

        echo json_encode(["data" => $data]);
    } else {
        echo json_encode(["error" => "Usuário não encontrado."]);
    } 

    $stmt->close();
    $conn->close();
?>
