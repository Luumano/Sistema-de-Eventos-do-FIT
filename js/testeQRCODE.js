$(document).ready(function() {
    function obterIdDoEvento() {
        const params = new URLSearchParams(window.location.search);
        return params.get('eventId');
    }

    const eventId = obterIdDoEvento();

    if (eventId) {
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(eventos) {
                const eventoSelecionado = eventos.find(evento => evento.id == eventId);
                if (eventoSelecionado) {
                    $('#event-title').text(eventoSelecionado.nome);
                    $('#event-palestra').text(eventoSelecionado.resumo || 'Sem informação');
                    $('#event-data').text(converterData(eventoSelecionado.data) || 'Data não definida');
                    $('#event-horario').text(formatarHorario(eventoSelecionado.horario) || 'Horário não definido');
                    $('#event-palestrante').text(eventoSelecionado.palestrante || 'Sem palestrante definido');
                    $('#event-local').text(eventoSelecionado.local || 'Local não definido');
                    $('#event-periodo').text(eventoSelecionado.periodo || 'Período não informado');
                    $('#titulo').text(eventoSelecionado.titulo || 'Sem informação');
                } else {
                    console.error("Evento não encontrado");
                }
            },
            error: function(error) {
                console.error("Erro ao buscar evento:", error);
            }
        });
    } else {
        console.error("ID do evento não encontrado na URL.");
    }

    function carregarEventos() {
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(resposta) {
                renderizarEventos(resposta);
            },
            error: function(error) {
                console.error("Erro ao buscar eventos:", error);
            }
        });
    }

    function converterData(data) {
        if (!data) return '';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function formatarHorario(horario) {
        if (!horario) return '';
        return horario.substring(0, 5);
    }

    function renderizarEventos(eventos) {
        const eventList = $('#event-list');
        eventList.empty();

        eventos.forEach(evento => {
            const eventItem = ` 
                <li class="event-item" data-id="${evento.id}">
                    <img src="./conexao/${evento.imagem}" alt="Imagem do evento" class="event-image" style="width: 100%; height:auto;"/>
                    <h4 class="event-title">${evento.titulo}</h4>
                    <p><strong>Palestrante:</strong> ${evento.palestrante}</p>
                    <p><strong>Data:</strong> ${converterData(evento.data)}</p>
                    <p><strong>Horário:</strong> ${formatarHorario(evento.horario)}</p>
                    <p><strong>Local:</strong> ${evento.local}</p>
                </li>
            `;
            eventList.append(eventItem);
        });

        $('.event-item').on('click', function() {
            const eventId = $(this).data('id');
            console.log("ID do Evento:", eventId);
            if (eventId) {
                window.location.href = `https://fitufccrateus.com.br/detalhesEventos?eventId=${eventId}`;
            } else {
                console.error("Evento ID não encontrado.");
            }   
        });
    }

    carregarEventos();

    var modal = $('#inscricao-modal');
    var span = $('.close');

    $('#inscricao-link').on('click', function(event) {
        event.preventDefault();

        $.ajax({
            url: './conexao/dados_modal.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#user-identificador').val(data.identificador);
                $('#nome').val(data.nome);
                $('#curso').val(data.curso);
                $('#instituicao').val(data.instituicao);
                $('#email').val(data.email);
                $('#telefone').val(data.telefone);
                modal.fadeIn();
            },
            error: function(xhr, status, error) {
                alert("Erro ao carregar dados: " + error);
            }
        });
    });

    span.on('click', function() {
        modal.fadeOut();
    });

    $(window).on('click', function(event) {
        if ($(event.target).is(modal)) {
            modal.fadeOut();
        }
    });

    $('#editar-dados').on('click', function() {
        $('#inscricao-form input').removeAttr('disabled');
    });

    $('#cancelar').on('click', function() {
        modal.fadeOut();
    });

    $('#confirmar-presenca').on('click', function() {
        let dadosUsuario = {
            identificador: $('#user-identificador').val(),
            nome: $('#nome').val(),
            email: $('#email').val(),
            evento: $('#event-title').text()
        };

        let dadosQRCode = {
            id_usuario: $('#user-identificador').val(),
            id_evento: eventId
        };

        const qrContainer = document.getElementById("qrcode");
        qrContainer.innerHTML = "";
        const qrcode = new QRCode(qrContainer, {
            text: JSON.stringify(dadosQRCode),
            width: 128,
            height: 128,
        });

        const canvas = qrContainer.querySelector('canvas');
        let base64QRCode = null;
        if (canvas) {
            base64QRCode = canvas.toDataURL('image/png');
        }

        $.ajax({
            url: './conexao/registros_eventos.php',
            method: 'POST',
            data: {
                ...dadosUsuario,
                qr_code_base: base64QRCode
            },
            success: function(response) {
                if (response.status === 'success') {
                    console.log(response);
                    alert(response.message);
                    
                    $('#download-qrcode').show();
                    $('#download-qrcode').off('click').on('click', function() {
                        if (canvas) {
                            const dataUrl = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.href = dataUrl;
                            link.download = 'qrcode.png';
                            link.click();
                        }
                    });
                    modal.fadeOut();
                } else {
                    alert("Erro: " + response.message);
                }
                $('#confirmar-presenca').prop('disabled', false);
            },
            error: function(xhr, status, error) {
                alert("Erro ao enviar a inscrição: " + error);
                $('#confirmar-presenca').prop('disabled', false);
            }
        }); 
    });

    $('#download-qrcode').hide();
});
