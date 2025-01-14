$.ajax({
    url: "./conexao/perfil_usuario.php",
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.data) {
            // Preencher as informações do usuário
            $('#user-name').text(response.data.nome);
            $('#user-email').text(response.data.email);
            $('#user-course').text(response.data.curso);
            $('#user-instituicao').text(response.data.instituicao);

            const eventsList = $('#events-list');
            if(response.data.events) {
                response.data.events.forEach(event => {
                    const listItem = `
                    <li>
                        Participante:
                        <span>${event.nome}</span> Evento:
                        <span>${event.evento}</span>
                        <div class="qrcode">
                            <img src="${event.qrcode}" alt="QR Code ${event.nome}">
                            <a href="${event.qrcode}" download="qrcode_${event.nome}.png">Baixar QR Code</a>
                        </div>
                    </li>
                    `;
                    eventsList.append(listItem);       
                });
            }
        } else {
            alert(response.error || "Erro ao carregar dados do usuário.");
        }
    },
    error: function() {
        alert("Erro ao buscar os dados do usuário.");
    }
});
