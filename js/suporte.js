// Enviar a mensagem para o backend
async function sendMessage(){
    const messageContent = document.getElementById('user-message').value.trim();

    if(!messageContent){
        alert('Por favor, digite uma mensagem.');
        return;
    }

    // Enviar a mensagem para o backend
    const response = await fetch('./conexao/suporte_message.php', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageContent })
    });

    const result = await response.json();
    if(result.success){
        alert('Mensagem enviada com sucesso!');
        document.getElementById('user-message').value = ''; // Limpar o campo de mensagem
        loadMessages(); // Carregar as mensagens atualizados
    } else {
        alert('Erro ao enviar mensagem');
    }
}

// Função para carregar as mensagens e respostas do usuário
async function loadMessages(){
    const response = await fetch('./conexao/suporte.php');
    const messages = await response.json();

    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';

    messages.forEach((msg) => {
        const messageItem = document.createElement('li');
        messageItem.className = 'message-item';

        messageItem.innerHTML = `
            <h3>Mensagem:</h3>
            <p>${msg.mensagens}</p>
            ${msg.resposta ? `<p class="response">Resposta: ${msg.resposta}</p>`: '<p class="response">Aguardando resposta...</p>'}
        `;

        messagesContainer.appendChild(messageItem);
    });
}

// Carregar as mensagens assim que a página é carregada
window.addEventListener('load', loadMessages);