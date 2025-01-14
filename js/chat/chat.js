document.addEventListener('DOMContentLoaded', function() {
    fetch('./conexao/chat/verificar_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('chat-section').style.display = 'block';
            } else {
                document.getElementById('login-form').style.display = 'block';
                document.getElementById('chat-section').style.display = 'none';
            }
        })
        .catch(error => console.error('Erro ao verificar sessão:', error));
});

document.querySelector('.conversation-form-submit').addEventListener('click', function() {
    const message = document.querySelector('.conversation-form-input').value;
    if (message.trim() !== '') {
        // Enviar a mensagem para o servidor
        fetch('./conexao/chat/enviar_mensagem.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Adicionar a mensagem na conversa
                const conversationList = document.querySelector('.conversation-list');
                const newMessage = document.createElement('li');
                newMessage.classList.add('conversation-item');
                newMessage.innerHTML = `
                    <div class="conversation-item-content">
                        <div class="conversation-item-text">${message}</div>
                        <div class="conversation-item-dropdown">
                            <button type="button" class="conversation-item-dropdown-toggle"><i class="ri-more-2-line"></i></button>
                            <ul class="conversation-item-dropdown-list">
                                <li><a href="#"><i class="ri-share-forward-line"></i> Forward</a></li>
                                <li><a href="#"><i class="ri-delete-bin-line"></i> Delete</a></li>
                            </ul>
                        </div>
                    </div>
                `;
                conversationList.appendChild(newMessage);
                document.querySelector('.conversation-form-input').value = '';
            } else {
                alert('Erro ao enviar mensagem.');
            }
        })
        .catch(error => console.error('Erro ao enviar mensagem:', error));
    }
});