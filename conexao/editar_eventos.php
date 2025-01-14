<?php
    include 'db.php';

    // Verificar se a requisição é POST
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        // Recebe o ID do evento e os dados do formulário
        $id = $_POST['id'];
        $nome = $_POST['nome'];
        $titulo = $_POST['titulo'];
        $palestrante = $_POST['palestrante'];
        $resumo = $_POST['resumo'];
        $local = $_POST['local'];
        $data = $_POST['data'];
        $horario = $_POST['horario'];
        $periodo = $_POST['periodo'];

        // Verificar se uma nova imagem foi enviada
        if(isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0){
            $imagem = $_FILES['imagem']['name'];
            $imagem_temp = $_FILES['imagem']['tmp_name'];

            // Caminho de destino para salvar a imagem
            $destino = '../uploads/' . $imagem;

            //Move a imagem para a pasta de destino
            if(!move_uploaded_file($imagem_temp, $destino)){
                echo json_encode(["success" => false, "message" => "Falha ao enviar a imagem."]);
                exit();
            }
        } else {
            // Se nenhuma nova imagem for enviada, mantenha a imagem existente
            $imagem = $_POST['imagem_existente'];
        }

        // SQL para atualizar o evento
        $sql = "UPDATE eventos SET nome = ?, titulo = ?, palestrante = ?, resumo = ?, local = ?, data = ?, horario = ?, periodo = ? WHERE id = ?";

        $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssssi", $nome, $titulo, $palestrante, $resumo, $local, $data, $horario, $periodo, $id);
    
    // Executa a atualização e verifica o sucesso
    if($stmt->execute()){
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao atualizar o evento."]);
    }


    // Fechar a conexão e a declaração
    $stmt->close();
    $conn->close();
} else{
    echo json_encode(["success" => false, "message" => "Método de requisição inválida"]);
}
?>