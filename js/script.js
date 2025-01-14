function toggleDetails(eventId) {
    let details = document.getElementById('details-' + eventId);
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

function registerUser(eventId, type) {
    let idField = document.getElementById(`${type}-${eventId}`);
    let nomeField = document.getElementById(type === 'matricula' ? `nome-${eventId}`  : `nome-ext-${eventId}`);
    let emailField = document.getElementById(type === 'matricula' ? `email-${eventId}` : `email-ext-${eventId}`);

    if (!idField || !nomeField || !emailField) {
        console.error('Campos de formulário não encontrados.');
        return;
    }

    let identificador = idField.value;
    let nome = nomeField.value;
    let email = emailField.value;

    let data = {
        id: identificador,
        tipo: type,
        nome: nome,
        email: email,
        evento: "Evento " + eventId
    };

    $.ajax({
        url: './conexao/register.php',
        method: 'POST',
        data: data,
        success: function(response){
            $(`#success-${eventId}`).show();

            const qrcode = new QRCode(document.getElementById(`qrcode-${eventId}`), {
                text: JSON.stringify(data),
                width: 128,
                height: 128,
            });

            //Adicionar a imagem
            const canvas = document.querySelector(`#qrcode-${eventId} canvas`);
            const context = canvas.getContext('2d');
            const logo = new Image();

            logo.onload = function() {
                const x = (canvas.width / 2) - (logo.width / 4);
                const y = (canvas.height / 2) - (logo.height / 4);
                context.drawImage(logo, x, y, logo.width / 2, logo.height / 2);
            };
            logo.src = '../imagens/grafox.png';

            //Cria Link para baixar o QR Code
            const downloadLink = $(`#download-${eventId}`);
            downloadLink.attr('href', canvas.toDataURL('image/png'));
            downloadLink.attr('download', `qrcode-${eventId}.png`);
        },
        error: function(error){
            console.log("Erro ao cadastrar usuário: ", error);
        }
    });
}
