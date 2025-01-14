$.ajax({
    url: "./conexao/perfil_usuario.php",
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        if(response.data){
            $('#nome-participante').text(response.data.nome);
            $('#ensino-instituicao').text(response.data.instituicao);
            $('#nome-participante').text(response.data.nome);
            $('#curso').text(response.data.curso);
        } else {
            alert(response.error || "Erro ao carregar dados do usuário.");
        }
    },
    error: function(){
        alert("Erro ai buscar os dados do usuário.");
    }
});

$(document).ready(function() {
    // Função para obter o ID do evento da URL
    function obterIdDoEvento() {
        const params = new URLSearchParams(window.location.search);
        return params.get('eventId');
    }

    const eventId = obterIdDoEvento();

    if (eventId) {
        // Fazer uma requisição para buscar os detalhes do evento
        $.ajax({
            url: './conexao/eventos.php',
            method: 'GET',
            dataType: 'json',
            success: function(eventos) {
                const eventoSelecionado = eventos.find(evento => evento.id == eventId);
                if (eventoSelecionado) {
                    // Preencher os detalhes do evento na página
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

    // Carregar os dados dos eventos
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
    // Formatando a data para formato numérico no padrão brasileiro
    function converterData(data) {
        if (!data) return ''; // Verifica se a data existe
        const [ano, mes, dia] = data.split('-'); // Divide a data no formato YYYY-MM-DD
        return `${dia}/${mes}/${ano}`; // Retorna no formato DD/MM/YYYY
    }
    
    //Função para Truncar Horário
        function formatarHorario(horario) {
        if (!horario) return ''; // Verifica se o horário existe
        return horario.substring(0, 5); // Retorna apenas os primeiros 5 caracteres (HH:MM)
    }



    // Renderiza os eventos
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

        // Mudar para o outro evento ao clicar nos itens
    $('.event-item').on('click', function() {
        const eventId = $(this).data('id');
        console.log("ID do Evento:", eventId); // Verifique se o ID do evento está correto
    if (eventId) {
        window.location.href = `https://fitufccrateus.com.br/detalhesEventos?eventId=${eventId}`;
    } else {
        console.error("Evento ID não encontrado.");
        }   
    });
}

    carregarEventos();

    // Modal para inscrição
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

    // Fechar o modal
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

    // Função para confirmar presença
    $('#confirmar-presenca').on('click', function() {
        let dadosUsuario = {
            identificador: $('#user-identificador').val(), // Corrigido para 'identificador'
            nome: $('#nome').val(),
            email: $('#email').val(),
            evento: $('#event-title').text()
        };
      
        let dadosQRCode = {
            // Alteração realizada no QR CODE que ao inves de pegar o nome do usuário e do evento, vamos pegar id deles.
			id_usuario: $('#user-identificador').val(), // O id do usuario que está sendo pegado é o identificador dele como: matricula ou CPF.
			id_evento: eventId
			
			//identificador: $('#user-identificador').val(),
            //nome: $('#nome').val(),
            //titulo: $('#title-event').text()
            //evento: eventoNomeTruncado
            //numero: numeroAleatorio
            //evento: $('#event-title').text()
        };


       // Gerar o QR Code
       const qrContainer = document.getElementById("qrcode");
       qrContainer.innerHTML = ""; // Limpar qualquer qr code anterior
       const qrcode = new QRCode(qrContainer,{
            text: JSON.stringify(dadosQRCode),
            width: 128,
            height: 128,
       });

            // Converter o QR Code em base64
            const canvas = qrContainer.querySelector('canvas');
            let base64QRCode = null;
            if(canvas){
                base64QRCode = canvas.toDataURL('image/png');
            } 
       
            // Unificar o envio dos dados do usuário e o QR Code em uma única requisição
            $.ajax({
                url: './conexao/registros_eventos.php',
                method: 'POST',
                data: {
                    ...dadosUsuario,
                    //numero_aleatorio: numeroAleatorio,  // Enviar o número aleatório
                    qr_code_base: base64QRCode
                },
                success: function(response){
                    if(response.status === 'success'){
                        console.log(response);
                        alert(response.message);

                        // Exibir o botão de download
                        $('#download-qrcode').show();

                        $('#download-qrcode').on('click', function(){
                            if(canvas){
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

                    // Reabilitar o botão ao final da requisição
                    $('#confirmar-presenca').prop('disabled', false);
                },
                error: function(xhr, status, error){
                    alert("Erro ao enviar a inscrição: " + error);
                    $('#confirmar-presenca').prop('disabled', false);
                }
            }); 
        });
		
		$('#download-qrcode').hide();
    }); 