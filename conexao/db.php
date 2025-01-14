<?php

    $servername = "mysql.hostinger.com";
    $username = "u794080646_crateusfit";
    $password = "Sistema@!FIT24";
    $dbname = "u794080646_CrateusFit";

    // Criar conexão
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexão
    if ($conn->connect_error) {
        die("conexão falhou: " . $conn->connect_error);
    }
?>