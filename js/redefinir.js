// Obtém o token da URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
document.getElementById('token').value = token;

document.getElementById('redefinir-senha-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const novaSenha = document.getElementById('nova-senha').value;
    const token = document.getElementById('token').value;

    // Enviar a solicitação de redefinição de senha para o backend
    fetch('./conexao/redefinir_senha.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, novaSenha })
    })
    .then(response => response.json())
    .then(data => {
        const statusMessage = document.getElementById('status-message');
        if (data.success) {
            statusMessage.innerHTML = "<p>Senha redefinida com sucesso!</p>";
            statusMessage.style.color = 'green';
        } else {
            statusMessage.innerHTML = "<p>Erro ao redefinir a senha. Tente novamente.</p>";
            statusMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Erro ao tentar redefinir a senha:', error);
        const statusMessage = document.getElementById('status-message');
        statusMessage.innerHTML = "<p>Ocorreu um erro. Tente novamente mais tarde.</p>";
        statusMessage.style.color = 'red';
    });
});
