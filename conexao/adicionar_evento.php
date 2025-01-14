<?php
include 'db.php'; // Verifique se a conexão está correta

// Recebe os dados do formulário
$nome = $_POST['nome'];
$resumo = $_POST['resumo'];
$local = $_POST['local'];
$palestrante = $_POST['palestrante'];
$data = $_POST['data'];
$horario = $_POST['horario'];
$periodo = $_POST['periodo'];
$titulo = $_POST['titulo'];

// Variável para armazenar o caminho da imagem (caso exista)
$targetFile = null;
$targetDir = "../uploads/"; // Diretório onde a imagem será salva


// Verificar se foi enviado um arquivo de imagem
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $imageFileType = strtolower(pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION));
    $imageName = uniqid() . '.' . $imageFileType;
    $targetFile = $targetDir . $imageName;

    // Verificar se o arquivo é realmente uma imagem
    $check = getimagesize($_FILES['imagem']['tmp_name']);
    if ($check !== false) {
        // Verificar tipo de imagem permitido
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array($imageFileType, $allowedTypes)) {
            // Movendo a imagem para a pasta de uploads
            if (!move_uploaded_file($_FILES['imagem']['tmp_name'], $targetFile)) {
                echo "Erro ao fazer upload da imagem.";
                $targetFile = null; // Se falhar, não defina o caminho da imagem
            }
        } else {
            echo "Tipo de arquivo não permitido. Apenas imagens JPG, PNG e GIF são aceitas.";
            $targetFile = null;
        }
    } else {
        echo "Arquivo enviado não é uma imagem.";
        $targetFile = null;
    }
} else {
    if ($_FILES['imagem']['error'] !== UPLOAD_ERR_NOFILE) {
        echo "Erro no envio da imagem: " . $_FILES['imagem']['error'];
    }
}

// Inserir os dados no banco de dados
if ($targetFile) {
    // Se a imagem foi carregada, insere o caminho da imagem no banco
    $sql = "INSERT INTO eventos (nome, resumo, local, palestrante, data, horario, imagem, periodo, titulo) VALUES (?,?,?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", $nome, $resumo, $local, $palestrante, $data, $horario, $targetFile, $periodo, $titulo);
} else {
    // Se a imagem não foi carregada, insere NULL ou uma string vazia para a imagem
    $sql = "INSERT INTO eventos (nome, resumo, local, palestrante, data, horario, imagem, periodo, titulo) VALUES (?,?,?,?,?,?,NULL,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssss", $nome, $resumo, $local, $palestrante, $data, $horario, $periodo, $titulo);
}

// Executar a consulta e verificar se foi bem-sucedida
if ($stmt->execute()) {
    header("Location: eventos.php");
    exit();
} else {
    echo "Erro ao adicionar evento: " . $stmt->error;
}

// Fechar a declaração e a conexão
$stmt->close();
$conn->close();
?>

