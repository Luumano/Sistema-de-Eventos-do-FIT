$(document).ready(function(){
    // Função para buscar os dadosde participação via AJAX
    function fetchParticipacaoData(){
        $.ajax({
            url: './conexao/participacao_data.php',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                populateTable(data);
                generateChart(data);
                displayAdditionalInfo(data);
            },
            error: function(){
                alert('Erro ao carregar os dados de participação.');
            }
        });
    }

    // Popula a tabela com os dados dos eventos
    function populateTable(data) {
        const tbody = $('#participationTable tbody');
        tbody.empty();

        data.events.forEach(event => {
            tbody.append(`
                <tr>
                    <td>${event.nome}</td>
                    <td>${event.participantes}</td>
                    <td>${event.data}</td>
                    <td>${event.local}</td>
                </tr>
                `);
        });
    }

    // Gera o gráfico de participação por evento
    function generateChart(data) {
        const ctx = document.getElementById('participationChart').getContext('2d');
        new CharacterData(ctx, {
            type: 'bar',
            data: {
                labels: data.events.map(event => event.nome),
                datasets: [{
                    label: 'Participantes Confirmados',
                    data: data.events.map(event => event.participantes),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Exibir informações adicionais como o evento mais popular
    function displayAdditionalInfo(data) {
        const maxEvent = data.events.reduce((prev, current) => (prev.participantes > current.participantes) ? prev : current);
        $('#additionalInfo').text(`O evento com mais participação foi "${maxEvent.nome}" com ${maxEvent.participantes} participantes.`);
    }

    // Chamar a função para buscar os dados quando a página carrega
    fetchParticipacaoData();
});