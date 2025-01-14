document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
    setupCamera();
});

function loadRegistrations(){
    fetch('./conexao/registrados.php')
        .then(response => {
            if(!response.ok){
                throw new Error('Erro na rede ao carregar registrados');
            }
            return response.json();
        })
        .then(data => {
            if(data.error){
                throw new Error(data.error);
            }
            const tablesContainer = document.getElementById('tables-container');
            // Limpar as tabelas existentes
            tablesContainer.innerHTML = '';

            //Agrupar os registros por evento
            const events = {};
            
            data.forEach(function(registration) {
                const eventName = registration.evento;

                if(!events[eventName]){
                    events[eventName] = { matricula: [], cpf: [] };
                }

                if(registration.tipo === 'matricula'){
                    events[eventName].matricula.push(registration);
                } else if(registration.tipo === 'cpf'){
                    events[eventName].cpf.push(registration);
                }
            });

            //Cria uma tabela para cada evento
            Object.keys(events).forEach(event => {
                //Tabela para matricula
                const matriculaTable = createTable(event, 'Matrícula', events[event].matricula);
                tablesContainer.appendChild(matriculaTable);

                //Tabela para CPF
                const cpfTable = createTable(event, 'CPF', events[event].cpf);
                tablesContainer.appendChild(cpfTable);
            }) ;
        })
        .catch(error => console.error('Erro ao carregar registros: ', error));
}

// Função para mostrar mensagem de confirmação
function showConfirmationMessage() {
    const confirmationMessage = document.createElement('p');
    confirmationMessage.textContent = 'Presença confirmada!';
    confirmationMessage.style.color = 'green';
    confirmationMessage.classList.add('confirmation-message');
    document.body.appendChild(confirmationMessage);
}

function confirmUser(qrData) {
    console.log('Conteúdo do QR Code:', qrData);

    // Parseia o QR Code como um objeto JSON
    const data = JSON.parse(qrData);

    const identificador = data.identificador;
    const evento = data.evento;

    if (!identificador || !evento) {
        console.error("QR Code está incompleto: faltando identificador ou evento.");
        return;
    }

    console.log('Dados enviados:', { identificador: identificador, evento: evento });

    fetch('./conexao/confirmar_presenca.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador, evento })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados recebidos da API:', data);

        if (data.success) {
            showConfirmationMessage();
            updateTableConfirmation(identificador, evento, new Date().toLocaleString());
        } else {
            console.error('Erro da API:', data.error || 'Erro na confirmação de presença');
        }
    })
    .catch(error => console.error('Erro ao confirmar presença:', error));
}

function updateTableConfirmation(identificador, evento, hora){
    const rows = document.querySelectorAll('#tables-container table tbody tr');
    rows.forEach(row => {
        const idCell = row.cells[0];
        const eventCell = row.cells[3];

        if(idCell.textContent === identificador && eventCell.textContent === evento){
            row.cells[4].textContent = 'Confirmado';
            row.cells[5].textContent = hora;
            row.classList.add('confirmed');
        }
    });
}

function createTable(event, type, registrations){
    const tableWrapper = document.createElement('div');
    const tableTitle = document.createElement('h2');
    tableTitle.textContent = `Registros por ${type} - Evento: ${event}`;
    tableWrapper.appendChild(tableTitle);

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Identificador</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Evento</th>
                <th>Confirmação</th>
                <th>Data/Hora</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    registrations.forEach(function(registration){
        const row = document.createElement('tr');
        row.classList.toggle('confirmed', registration.confirmado === 'Confirmado'); // Verifica se o registro foi confirmado
        row.innerHTML = `
            <td class="${registration.confirmado === 'Confirmado' ? 'confirmed' : ''}">${registration.identificador}</td>
            <td class="${registration.confirmado === 'Confirmado' ? 'confirmed' : ''}">${registration.nome}</td>
            <td class="${registration.confirmado === 'Confirmado' ? 'confirmed' : ''}">${registration.email}</td>
            <td class="${registration.confirmado === 'Confirmado' ? 'confirmed' : ''}">${registration.evento}</td>
            <td class="${registration.confirmado === 'Confirmado' ? 'confirmed' : ''}">${registration.confirmado === 'Confirmado' ? 'Confirmado' : ''}</td>
            <td class="${registration.confirmado === 'Confirmado' ? 'confirmed' : ''}">${registration.hora || ''}</td>
        `;
        row.classList.toggle('confirmed', registration.confirmado === 'Confirmado');
        tbody.appendChild(row);
    });

    tableWrapper.appendChild(table);
    return tableWrapper;
}

function setupCamera() {
    document.getElementById('openCameraButton').addEventListener('click', function () {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(function (stream) {
                    const video = document.getElementById('video');
                    video.srcObject = stream;
                    video.style.display = 'block';

                    const canvas = document.getElementById('canvas');
                    const context = canvas.getContext('2d', { willReadFrequently: true });

                    video.addEventListener('play', function () {
                        // Escaneia continuamente até detectar um QR code
                        function scanQRCode() {
                            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                                const code = jsQR(imageData.data, imageData.width, imageData.height);

                                if (code) {
                                    confirmUser(code.data);
                                    video.srcObject.getTracks().forEach(track => track.stop());
                                    video.style.display = 'none';
                                }
                            }
                            requestAnimationFrame(scanQRCode);
                        }
                        requestAnimationFrame(scanQRCode);
                    });
                })
                .catch(function (err) {
                    console.error("Ocorreu um erro ao acessar a câmera: " + err);
                });
        } else {
            console.log("A API getUserMedia não é suportada neste navegador.");
        }
    });
}

document.getElementById('downloadExcel').addEventListener('click', function() {
    const data = JSON.parse(localStorage.getItem('registrations')) || [];
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'inscricoes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
});