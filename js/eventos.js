function toggleDetails(eventId) {
    const detailsElement = document.getElementById(`details-${eventId}`);
    const isVisible = detailsElement.style.display === 'block';

    // Alterna a visibilidade dos detalhes
    detailsElement.style.display = isVisible ? 'none' : 'block';
}

function loadEvents(){
    $.ajax({
        url: './conexao/eventos.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            renderEvents(data);
        },
        error: function(error) {
            console.log("Erro ao carregar eventos: ", error);
        }
    });
}
// Função para renderizar eventos na página
function renderEvents(events) {
    const eventList = $('#event-list');
    if(events.length === 0) {
        eventList.append('<li>Nenhum evento cadastrado no momento.</li>');
    } else {
        events.forEach(event => {
            eventList.append(`
                <li class="event-item" onclick="toggleDetails(${event.id})">
                    <div class="header">
                        <div class="title">
                        <img src="./imagens/grafox.png">
                        </div>
                    </div> 
                    <h2 class="event-title">${event.titulo}</h2>
                    <p>Data: ${event.data}, Local: ${event.local}, Horário: ${event.horario}</p>

                    <!-- Novos detalhes do evento -->
                    <div class="event-details" id="details-${event.id}" style="display:none;">

                        <!-- Formulário para alunos da UFC -->
                        <form class="event-form" onsubmit="event.preventDefault(); registerUser(${event.id}, 'matricula');">                         
                            <label for="matricula-${event.id}">Matricula:</label>
                            <input type="text" name="matricula" id="matricula-${event.id}" placeholder="Matricula" required>
                            <label for="nome-${event.id}">Nome:</label>
                            <input type="text" name="nome" id="nome-${event.id}" placeholder="Nome" required>
                            <label for="email-${event.id}">Email:</label>
                            <input type="email" id="email-${event.id}" placeholder="Email" required>
                            <button type="submit">Confirmar Evento</button>
                        </form>

                        <!-- Formulário para alunos de outras instituições -->
                        <form class="event-form" onsubmit="event.preventDefault(); registerUser(${event.id}, 'cpf');">
                            <h3>Cadastro para alunos de outras instituições</h3>
                            <label for="cpf-${event.id}">CPF:</label>
                            <input type="text" name="cpf" id="cpf-${event.id}" placeholder="CPF" required>
                            <label for="nome-ext-${event.id}">Nome:</label>
                            <input type="text" name="nome" id="nome-ext-${event.id}" placeholder="Nome completo" required>
                            <label for="email-ext-${event.id}">Email:</label>
                            <input type="email" name="email" id="email-ext-${event.id}" placeholder="Email" required>
                            <button type="submit">Cadastrar</button>
                        </form>

                        <!-- QR Code e mensagem de sucesso -->
                        <div class="registration-success" id="success-${event.id}" style="display: none;">
                            <p>Cadastrado com sucesso!</p>
                            <p>Mostre o QR Code na entrada do evento!</p>
                            <div id="qrcode-${event.id}"></div>
                            <a id="download-${event.id}" download="qrcode.png">Baixar QR Code</a>
                        </div>
                    </div>
                </li>
            `);
        });
    }
}
// Carregar os eventos quando a página é carregada
$(document).ready(function() {
    loadEvents();
});