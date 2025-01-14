document.getElementById('openCameraButton').addEventListener('click', function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function (stream) {
                const video = document.getElementById('video');
                video.srcObject = stream;
                video.style.display = 'block';

                const canvas = document.getElementById('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });

                let lastQRCodeData = '';  // Variável para armazenar o último QR Code lido

                video.addEventListener('play', function() {
                    function scanQRCode() {
                        if (video.readyState === video.HAVE_ENOUGH_DATA) {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            context.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height);

                            if (code && code.data !== lastQRCodeData) {  // Verifique se o QR Code lido é novo
                                lastQRCodeData = code.data;  // Atualiza o último QR Code lido
                                confirmUser(code.data);

                                // Aguarde 3 segundos antes de permitir a próxima leitura
                                setTimeout(() => { lastQRCodeData = ''; }, 3000);
                            }
                        }
                        requestAnimationFrame(scanQRCode);  // Continua escaneando
                    }
                    requestAnimationFrame(scanQRCode);
                });
            })
            .catch(function(err) {
                console.error("Erro ao acessar a câmera: " + err);
            });
    } else {
        console.log("API getUserMedia não suportada neste navegador.");
    }
});

function confirmUser(qrData) {
    try {
        let nome, evento;

        // Tente tratar o QR Code como JSON se possível
        if (qrData.startsWith("{") && qrData.endsWith("}")) {
            const data = JSON.parse(qrData); // Tenta converter para JSON
            nome = data.nome;
            evento = data.evento;
        } else {
            // Caso não seja um JSON, tentamos buscar o nome e evento a partir de texto simples
            const nomeMatch = qrData.match(/Nome:\s*([^,]+)/);
            const eventoMatch = qrData.match(/Evento:\s*([^,]+)/);

            if (nomeMatch && eventoMatch) {
                nome = nomeMatch[1].trim();
                evento = eventoMatch[1].trim();
            }
        }

        // Verifique se ambos os campos (nome e evento) estão presentes
        if (!nome || !evento) {
            console.error("QR Code incompleto ou formato inválido.");
            alert("QR Code incompleto ou formato inválido.");
            return;
        }

        console.log(`Confirmando presença para: Nome - ${nome}, Evento - ${evento}`);  // Log para depuração

        // Enviar os dados para o servidor
        fetch('./conexao/confirmar_presenca.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, evento })
        })
        .then(response => response.text())  // Alterado para text() para ver o conteúdo bruto
        .then(data => {
            console.log("Resposta do servidor: ", data);  // Log para depuração

            // Tente analisar a resposta como JSON
            try {
                const jsonResponse = JSON.parse(data);
                if (jsonResponse.success) {
                    alert('Presença confirmada!');
                } else {
                    console.error('Erro ao confirmar presença:', jsonResponse.error);
                    alert(jsonResponse.error);  // Exibe o erro retornado pelo servidor
                }
            } catch (e) {
                console.error('Erro ao analisar a resposta JSON:', e);
                alert('Erro na resposta do servidor');
            }
        })
        .catch(error => {
            console.error('Erro ao confirmar presença:', error);
            alert('Erro ao confirmar presença');
        });
    } catch (error) {
        console.error('Erro ao processar o QR Code:', error);
        alert("Erro ao processar o QR Code.");
    }
}
