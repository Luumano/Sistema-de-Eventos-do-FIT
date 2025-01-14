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
                    <h2 class="event-title">${event.nome}</h2>
                    <p><i class="fa fa-calendar card-home__icone"></i> ${event.data}, ${event.local}, ${event.horario}</p>
                    <a href="teste_eventos.html" class="card_home">Saiba mais</a>
                </li>
            `);
        });
    }
}
// Carregar os eventos quando a página é carregada
$(document).ready(function() {
    loadEvents();
});