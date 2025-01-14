document.getElementById('login-button').addEventListener('click', function() {
    const identificador = document.getElementById('login-identificador').value;
    const senha = document.getElementById('login-senha').value;

    fetch('./conexao/chat/verificar_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identificador, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('chat-section').style.display = 'block';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Erro ao fazer login:', error));
});