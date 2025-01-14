<?php

include 'db.php'; // Certifique-se de que o arquivo 'db.php' contém a conexão com o banco de dados
include 'phpqrcode/qrlib.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Verifica se os dados necessários foram enviados
    if (isset($_POST['identificador']) && isset($_POST['nome']) && isset($_POST['email']) && isset($_POST['evento'])) {
        
        // Receber os dados do formulário
        $identificador = $_POST['identificador'];
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $evento = $_POST['evento'];

        // Validar os dados
        if (empty($identificador) || empty($nome) || empty($email) || empty($evento)) {
            echo json_encode(['status' => 'error', 'message' => 'Todos os campos são obrigatórios.']);
            exit;
        }


        // Prevenir SQL Injection
        $identificador = mysqli_real_escape_string($conn, $identificador);
        $nome = mysqli_real_escape_string($conn, $nome);
        $email = mysqli_real_escape_string($conn, $email);
        $evento = mysqli_real_escape_string($conn, $evento);

        // Lógica para determinar o tipo de identificador (CPF ou Matrícula)
        if (strlen($identificador) == 6) {
            // $identificador = 'Matrícula';  // Identificador de matrícula, sem sobrescrever o valor
        } elseif (strlen($identificador) == 11) {
            // $identificador = 'CPF'; // Identificador de CPF, sem sobrescrever o valor
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Identificador inválido. Deve ser 6 dígitos (Matrícula) ou 11 dígitos (CPF).']);
            exit;
        }

        // Gerar o conteúdo do QR Code
        $qrText = "Nome: $nome, Evento: $evento";
        
        // Nome e caminho do arquivo para salvar o QR Code
        $qrFileName = 'qrcode_' . $identificador . '.png';
        $qrFilePath = 'qrcodes/' . $qrFileName;

        // Gerar o QR Code e salvar o arquivo
        QRcode::png($qrText, $qrFilePath, QR_ECLEVEL_L, 4);

        // Verificar se o QR Code foi gerado e salvo corretamente
        if(file_exists($qrFilePath)){
            $sql = "INSERT INTO registros_eventos (identificador, nome, email, evento, qr_code) VALUES (?, ?, ?, ?, ?)";
            
            // Preparar a consulta
            $stmt = $conn->prepare($sql);
            if($stmt){
                // Bind dos parâmetros, incluindo o tipo de identificador (CPF ou Matrícula)
                $stmt->bind_param("sssss", $identificador, $nome, $email, $evento, $qrFilePath);

                // Executar a consulta
                if($stmt->execute()){
                    echo json_encode(['status' => 'success', 'message' => 'Inscrição realizada com sucesso!']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Erro ao inserir no banco de dados: ' . $stmt->error]);
                }

                // Fechar a declaração
                $stmt->close();
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao preparar a consulta: ' . $conn->error]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao gerar o QR Code.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
    }
} 
// Fechar a conexão
$conn->close();

?>

