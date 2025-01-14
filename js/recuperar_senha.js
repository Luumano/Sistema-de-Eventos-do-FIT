document.getElementById('checkNomeBtn').addEventListener('click', function() {
    const nome = document.getElementById('nome').value.trim();
    const identificador = document.getElementById('identificador').value.trim();
    
    if (!nome || !identificador) {
        alert('Por favor, preencha o nome completo e o identificador (matrícula ou CPF)');
        return;
    }

    // Enviar o nome e identificador para o servidor verificar se o usuário existe
    fetch('./conexao/verificar_nome.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, identificador })
    })
    .then(response => response.json())
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');
        if (data.success) {
            responseMessage.textContent = 'Nome e identificador encontrados! Agora, você pode definir sua nova senha.';
            responseMessage.classList.remove('error');
            document.getElementById('nomeForm').style.display = 'none';
            document.getElementById('novaSenhaForm').style.display = 'block';
        } else {
            responseMessage.textContent = data.message;
            responseMessage.classList.add('error');
        }
    })
    .catch(error => {
        console.error('Erro ao verificar o nome e identificador:', error);
    });
});

document.getElementById('updateSenhaBtn').addEventListener('click', function() {
    const nome = document.getElementById('nome').value.trim();
    const identificador = document.getElementById('identificador').value.trim();
    const novaSenha = document.getElementById('novaSenha').value.trim();

    if (!novaSenha) {
        alert('Por favor, informe uma nova senha');
        return;
    }

    // Enviar nome, identificador e nova senha para o servidor
    fetch('./conexao/recuperar_senha.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, identificador, novaSenha })
    })
    .then(response => response.json())
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');
        if (data.success) {
            responseMessage.textContent = 'Senha atualizada com sucesso!';
            responseMessage.classList.remove('error');
            
            // Redirecionar para a página de login após a atualização da senha
            setTimeout(function() {
                window.location.href = 'index.html';  // Substitua 'index.html' pelo caminho correto da sua página de login
            }, 2000); // Aguarda 2 segundos antes de redirecionar
        } else {
            responseMessage.textContent = data.message;
            responseMessage.classList.add('error');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar a senha:', error);
    });
});
