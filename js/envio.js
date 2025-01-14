$(document).ready(function(){
    // Variável global para armazenar os eventos
    let eventos = [];

    //Função para carregar os dados dos eventos
    function carregarEventos(){
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(resposta){
                console.log(resposta);
                    eventos = resposta;
                    renderizarEventos(resposta);
            },
            error: function(error){
                console.error("Erro ao buscar eventos:", error);
            }
        });
    }

    //Função que renderiza os eventos
    function renderizarEventos(eventos){
        const eventList = $('#event-list');
        eventList.empty();

        eventos.forEach(evento => {
            const eventItem = `
                <li class="event-item" data-id="${evento.id}">
                    <h3 class="event-title">${evento.nome}</h3>
                    <p><strong>Data:</strong> ${evento.data}</p>
                    <p><strong>Horário:</strong> ${evento.horario}</p>
                    <p><strong>Local:<strong> ${evento.local}</p>
                </li>
            `;
            eventList.append(eventItem);
        });

        //Adicionar evento de clique aos itens
        $('.event-item').on('click', function(){
            // Obtém o ID do evento clicado
            const eventId = $(this).data('id');
            // Redireciona para outra página, passando o ID do evento na URL
            window.location.href = `detalhesEventos?eventId=${eventId}`;
            
            if(!eventoSelecionado){
                console.error('Evento não encontrado para o ID:', eventId);
                return;
            }

            mostrarDetalhesDoEvento(eventoSelecionado);
        });
    }
    carregarEventos();
});

//Programação
$(document).ready(function(){
    //Fazer uma requisição para o back-end
    $.ajax({
        url: './conexao/eventos.php',
        method: 'GET',
        success: function(data){
            //Tratando os dados que vêm do backend
            if(data.length > 0){
                //Vai exibir o primeiro evento
                mostrarDetalhesDoEvento(data[0]);
            } else {
                console.log("Nenhum evento encontrado.");
            }
        },
        error: function(error){
            console.log("Erro ao buscar os eventos:", error);
        }
    });
});

function mostrarDetalhesDoEvento(evento){
    //Preenchimento dos dados do evento nos campos apropriados
    $('#event-title').text(evento.nome);
    $('#event-palestra').text(evento.resumo || 'Sem informação');
    $('#event-data').text(evento.data || 'Data não definida');
    $('#event-horario').text(evento.horario || 'Horário não definida');
    $('#event-palestrante').text(evento.palestrante || 'Sem palestrante definido');
    $('#event-local').text(evento.local || 'Local não definido');
    $('#event-periodo').text(evento.periodo || 'Período não informado'); 
}

$(document).ready(function(){
    var modal = $('#inscricao-modal');
    var span = $('.close');

    $('#inscricao-link').on('click', function(event) {
        event.preventDefault();

        $.ajax({
            url: './conexao/dados_modal.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#nome').val(data.nome);
                $('#data-nascimento').val(data.data_nascimento);
                $('#curso').val(data.curso);
                $('#instituicao').val(data.instituicao);
                $('#email').val(data.email);
                $('#telefone').val(data.telefone);
                // Mostrar modal
                modal.fadeIn();
            },
            error: function(xhr, status, error){
                alert("Erro ao carregar dados: " + error);
            }
        });
    });

    // Quando o usuário clicar no botão de fechar(x)
    span.on('click', function() {
        modal.fadeOut();
    });

    // Fechar modal se o usuário clicar fora da áreal do modal
    $(window).on('click', function(event){
        if($(event.target).is(modal)){
            modal.fadeOut();
        }
    });

    // Quando o usuário clicar no botão cancelar
    $('#cancelar').on('click', function(){
        modal.fadeOut();
    });
});$(document).ready(function(){
    // Variável global para armazenar os eventos
    let eventos = [];

    //Função para carregar os dados dos eventos
    function carregarEventos(){
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(resposta){
                console.log(resposta);
                    eventos = resposta;
                    renderizarEventos(resposta);
            },
            error: function(error){
                console.error("Erro ao buscar eventos:", error);
            }
        });
    }

    //Função que renderiza os eventos
    function renderizarEventos(eventos){
        const eventList = $('#event-list');
        eventList.empty();

        eventos.forEach(evento => {
            const eventItem = `
                <li class="event-item" data-id="${evento.id}">
                    <h3 class="event-title">${evento.nome}</h3>
                    <p><strong>Data:</strong> ${evento.data}</p>
                    <p><strong>Horário:</strong> ${evento.horario}</p>
                    <p><strong>Local:<strong> ${evento.local}</p>
                </li>
            `;
            eventList.append(eventItem);
        });

        //Adicionar evento de clique aos itens
        $('.event-item').on('click', function(){
            // Obtém o ID do evento clicado
            const eventId = $(this).data('id');
            // Redireciona para outra página, passando o ID do evento na URL
            window.location.href = `detalhesEventos?eventId=${eventId}`;
            
            if(!eventoSelecionado){
                console.error('Evento não encontrado para o ID:', eventId);
                return;
            }

            mostrarDetalhesDoEvento(eventoSelecionado);
        });
    }
    carregarEventos();
});

//Programação
$(document).ready(function(){
    //Fazer uma requisição para o back-end
    $.ajax({
        url: './conexao/eventos.php',
        method: 'GET',
        success: function(data){
            //Tratando os dados que vêm do backend
            if(data.length > 0){
                //Vai exibir o primeiro evento
                mostrarDetalhesDoEvento(data[0]);
            } else {
                console.log("Nenhum evento encontrado.");
            }
        },
        error: function(error){
            console.log("Erro ao buscar os eventos:", error);
        }
    });
});

function mostrarDetalhesDoEvento(evento){
    //Preenchimento dos dados do evento nos campos apropriados
    $('#event-title').text(evento.nome);
    $('#event-palestra').text(evento.resumo || 'Sem informação');
    $('#event-data').text(evento.data || 'Data não definida');
    $('#event-horario').text(evento.horario || 'Horário não definida');
    $('#event-palestrante').text(evento.palestrante || 'Sem palestrante definido');
    $('#event-local').text(evento.local || 'Local não definido');
    $('#event-periodo').text(evento.periodo || 'Período não informado'); 
}

$(document).ready(function(){
    var modal = $('#inscricao-modal');
    var span = $('.close');

    $('#inscricao-link').on('click', function(event) {
        event.preventDefault();

        $.ajax({
            url: './conexao/dados_modal.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#nome').val(data.nome);
                $('#data-nascimento').val(data.data_nascimento);
                $('#curso').val(data.curso);
                $('#instituicao').val(data.instituicao);
                $('#email').val(data.email);
                $('#telefone').val(data.telefone);
                // Mostrar modal
                modal.fadeIn();
            },
            error: function(xhr, status, error){
                alert("Erro ao carregar dados: " + error);
            }
        });
    });

    // Quando o usuário clicar no botão de fechar(x)
    span.on('click', function() {
        modal.fadeOut();
    });

    // Fechar modal se o usuário clicar fora da áreal do modal
    $(window).on('click', function(event){
        if($(event.target).is(modal)){
            modal.fadeOut();
        }
    });

    // Quando o usuário clicar no botão cancelar
    $('#cancelar').on('click', function(){
        modal.fadeOut();
    });
});$(document).ready(function(){
    // Variável global para armazenar os eventos
    let eventos = [];

    //Função para carregar os dados dos eventos
    function carregarEventos(){
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(resposta){
                console.log(resposta);
                    eventos = resposta;
                    renderizarEventos(resposta);
            },
            error: function(error){
                console.error("Erro ao buscar eventos:", error);
            }
        });
    }

    //Função que renderiza os eventos
    function renderizarEventos(eventos){
        const eventList = $('#event-list');
        eventList.empty();

        eventos.forEach(evento => {
            const eventItem = `
                <li class="event-item" data-id="${evento.id}">
                    <h3 class="event-title">${evento.nome}</h3>
                    <p><strong>Data:</strong> ${evento.data}</p>
                    <p><strong>Horário:</strong> ${evento.horario}</p>
                    <p><strong>Local:<strong> ${evento.local}</p>
                </li>
            `;
            eventList.append(eventItem);
        });

        //Adicionar evento de clique aos itens
        $('.event-item').on('click', function(){
            // Obtém o ID do evento clicado
            const eventId = $(this).data('id');
            // Redireciona para outra página, passando o ID do evento na URL
            window.location.href = `detalhesEventos?eventId=${eventId}`;
            
            if(!eventoSelecionado){
                console.error('Evento não encontrado para o ID:', eventId);
                return;
            }

            mostrarDetalhesDoEvento(eventoSelecionado);
        });
    }
    carregarEventos();
});

//Programação
$(document).ready(function(){
    //Fazer uma requisição para o back-end
    $.ajax({
        url: './conexao/eventos.php',
        method: 'GET',
        success: function(data){
            //Tratando os dados que vêm do backend
            if(data.length > 0){
                //Vai exibir o primeiro evento
                mostrarDetalhesDoEvento(data[0]);
            } else {
                console.log("Nenhum evento encontrado.");
            }
        },
        error: function(error){
            console.log("Erro ao buscar os eventos:", error);
        }
    });
});

function mostrarDetalhesDoEvento(evento){
    //Preenchimento dos dados do evento nos campos apropriados
    $('#event-title').text(evento.nome);
    $('#event-palestra').text(evento.resumo || 'Sem informação');
    $('#event-data').text(evento.data || 'Data não definida');
    $('#event-horario').text(evento.horario || 'Horário não definida');
    $('#event-palestrante').text(evento.palestrante || 'Sem palestrante definido');
    $('#event-local').text(evento.local || 'Local não definido');
    $('#event-periodo').text(evento.periodo || 'Período não informado'); 
}

$(document).ready(function(){
    var modal = $('#inscricao-modal');
    var span = $('.close');

    $('#inscricao-link').on('click', function(event) {
        event.preventDefault();

        $.ajax({
            url: './conexao/dados_modal.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#nome').val(data.nome);
                $('#data-nascimento').val(data.data_nascimento);
                $('#curso').val(data.curso);
                $('#instituicao').val(data.instituicao);
                $('#email').val(data.email);
                $('#telefone').val(data.telefone);
                // Mostrar modal
                modal.fadeIn();
            },
            error: function(xhr, status, error){
                alert("Erro ao carregar dados: " + error);
            }
        });
    });

    // Quando o usuário clicar no botão de fechar(x)
    span.on('click', function() {
        modal.fadeOut();
    });

    // Fechar modal se o usuário clicar fora da áreal do modal
    $(window).on('click', function(event){
        if($(event.target).is(modal)){
            modal.fadeOut();
        }
    });

    // Quando o usuário clicar no botão cancelar
    $('#cancelar').on('click', function(){
        modal.fadeOut();
    });
});$(document).ready(function(){
    // Variável global para armazenar os eventos
    let eventos = [];

    //Função para carregar os dados dos eventos
    function carregarEventos(){
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(resposta){
                console.log(resposta);
                    eventos = resposta;
                    renderizarEventos(resposta);
            },
            error: function(error){
                console.error("Erro ao buscar eventos:", error);
            }
        });
    }

    //Função que renderiza os eventos
    function renderizarEventos(eventos){
        const eventList = $('#event-list');
        eventList.empty();

        eventos.forEach(evento => {
            const eventItem = `
                <li class="event-item" data-id="${evento.id}">
                    <h3 class="event-title">${evento.nome}</h3>
                    <p><strong>Data:</strong> ${evento.data}</p>
                    <p><strong>Horário:</strong> ${evento.horario}</p>
                    <p><strong>Local:<strong> ${evento.local}</p>
                </li>
            `;
            eventList.append(eventItem);
        });

        //Adicionar evento de clique aos itens
        $('.event-item').on('click', function(){
            // Obtém o ID do evento clicado
            const eventId = $(this).data('id');
            // Redireciona para outra página, passando o ID do evento na URL
            window.location.href = `detalhesEventos?eventId=${eventId}`;
            
            if(!eventoSelecionado){
                console.error('Evento não encontrado para o ID:', eventId);
                return;
            }

            mostrarDetalhesDoEvento(eventoSelecionado);
        });
    }
    carregarEventos();
});

//Programação
$(document).ready(function(){
    //Fazer uma requisição para o back-end
    $.ajax({
        url: './conexao/eventos.php',
        method: 'GET',
        success: function(data){
            //Tratando os dados que vêm do backend
            if(data.length > 0){
                //Vai exibir o primeiro evento
                mostrarDetalhesDoEvento(data[0]);
            } else {
                console.log("Nenhum evento encontrado.");
            }
        },
        error: function(error){
            console.log("Erro ao buscar os eventos:", error);
        }
    });
});

function mostrarDetalhesDoEvento(evento){
    //Preenchimento dos dados do evento nos campos apropriados
    $('#event-title').text(evento.nome);
    $('#event-palestra').text(evento.resumo || 'Sem informação');
    $('#event-data').text(evento.data || 'Data não definida');
    $('#event-horario').text(evento.horario || 'Horário não definida');
    $('#event-palestrante').text(evento.palestrante || 'Sem palestrante definido');
    $('#event-local').text(evento.local || 'Local não definido');
    $('#event-periodo').text(evento.periodo || 'Período não informado'); 
}

$(document).ready(function(){
    var modal = $('#inscricao-modal');
    var span = $('.close');

    $('#inscricao-link').on('click', function(event) {
        event.preventDefault();

        $.ajax({
            url: './conexao/dados_modal.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#nome').val(data.nome);
                $('#data-nascimento').val(data.data_nascimento);
                $('#curso').val(data.curso);
                $('#instituicao').val(data.instituicao);
                $('#email').val(data.email);
                $('#telefone').val(data.telefone);
                // Mostrar modal
                modal.fadeIn();
            },
            error: function(xhr, status, error){
                alert("Erro ao carregar dados: " + error);
            }
        });
    });

    // Quando o usuário clicar no botão de fechar(x)
    span.on('click', function() {
        modal.fadeOut();
    });

    // Fechar modal se o usuário clicar fora da áreal do modal
    $(window).on('click', function(event){
        if($(event.target).is(modal)){
            modal.fadeOut();
        }
    });

    // Quando o usuário clicar no botão cancelar
    $('#cancelar').on('click', function(){
        modal.fadeOut();
    });
});