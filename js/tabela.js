document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
    setInterval(loadRegistrations, 10000); // Atualiza a tabela a cada 10 segundos

    // Função para realizar a pesquisa
    document.getElementById('searchButton').addEventListener('click', function() {
        const searchValue = document.getElementById('searchInput').value.trim();
        if (searchValue) {
            searchRegistration(searchValue);
        } else {
            loadRegistrations(); // Recarrega a tabela completa se o campo de pesquisa estiver vazio
        }
    });
});

function loadRegistrations() {
    fetch('./conexao/registrados.php')
        .then(response => response.json())
        .then(data => {
            console.log("Dados recebidos:", data); // Log para inspecionar os dados
            renderTables(data);
        })
        .catch(error => console.log(error));
}

// Função de busca de registro
function searchRegistration(searchValue) {
    fetch('./conexao/registrados.php')
        .then(response => response.json())
        .then(data => {
            // Filtra os registros por identificador ou nome com base no valor de pesquisa
            const filteredData = data.filter(registration => {
                return registration.identificador.includes(searchValue) || registration.nome.includes(searchValue);
            });
            renderTables(filteredData);
        })
        .catch(error => console.error('Erro ao buscar registros:', error));
}

function renderTables(data) {
    const tablesContainer = document.getElementById('tables-container');
    if (!tablesContainer) {
        console.error("Elemento 'tables-container' não encontrado.");
        return;
    }

    tablesContainer.innerHTML = ''; // Limpa o conteúdo atual

    // Verifique se há dados para processar
    if (data.length === 0) {
        tablesContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    // Agrupar registros por evento
    const groupedByEvent = {};

    data.forEach(registration => {
        const eventName = registration.evento;
        if (!groupedByEvent[eventName]) {
            groupedByEvent[eventName] = { matricula: [], cpf: [] };
        }

        if (registration.identificador.length === 6) {
            groupedByEvent[eventName].matricula.push(registration);
        } else if (registration.identificador.length === 11) {
            groupedByEvent[eventName].cpf.push(registration);
        }
    });

    console.log(groupedByEvent); // Log para depuração

    // Criar tabelas para cada evento
    Object.keys(groupedByEvent).forEach(eventName => {
        const eventGroup = groupedByEvent[eventName];

        // Criar uma tabela para Matrícula, se houver registros
        if (eventGroup.matricula.length > 0) {
            const matriculaTable = createTable('Matrícula', eventGroup.matricula, eventName);
            tablesContainer.appendChild(matriculaTable);
        }

        // Criar uma tabela para CPF, se houver registros
        if (eventGroup.cpf.length > 0) {
            const cpfTable = createTable('CPF', eventGroup.cpf, eventName);
            tablesContainer.appendChild(cpfTable);
        }
    });
}

// Função para criar a tabela de um tipo específico
function createTable(type, registrations, eventName) {
    const tableWrapper = document.createElement('div');
    const tableTitle = document.createElement('h2');
    tableTitle.textContent = `Registros de ${type} - Evento: ${eventName}`;
    tableWrapper.appendChild(tableTitle);

    const downloadButton = document.createElement('button');
    downloadButton.textContent = `Baixar Dados de ${eventName} - ${type}`;
    downloadButton.addEventListener('click', () => downloadButtonEventData(registrations, `${eventName}_${type}`));
    tableWrapper.appendChild(downloadButton);

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
                <th>Ações</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    registrations.forEach(function(registration) {
        const row = document.createElement('tr');
        const isConfirmed = isConfirmedPresence(registration.nome, registration.evento); // Verifica no localStorage se já foi confirmado
        row.classList.toggle('confirmed', isConfirmed);
        row.innerHTML = `
            <td class="${isConfirmed ? 'confirmed' : ''}">${registration.identificador}</td>
            <td class="${isConfirmed ? 'confirmed' : ''}">${registration.nome}</td>
            <td class="${isConfirmed ? 'confirmed' : ''}">${registration.email}</td>
            <td class="${isConfirmed ? 'confirmed' : ''}">${registration.evento}</td>
            <td class="${isConfirmed ? 'confirmed' : ''}">${isConfirmed ? 'Confirmado' : ''}</td>
            <td class="${isConfirmed ? 'confirmed' : ''}">${isConfirmed ? getConfirmationTime(registration.nome, registration.evento) : ''}</td>
        `;

        const actionCell = document.createElement('td');
        const confirmButton = document.createElement('button-confirm');
        confirmButton.textContent = 'Confirmar Presença';
        confirmButton.addEventListener('click', () => confirmPresence(registration.nome, registration.evento));
        actionCell.appendChild(confirmButton);

        row.appendChild(actionCell);
        tbody.appendChild(row);
    });

    tableWrapper.appendChild(table);
    return tableWrapper;
}

function downloadButtonEventData(registrations, fileName) {
    // Criar uma estrutura de dados para exportação
    const data = registrations.map(registration => ({
        Identificador: registration.identificador,
        Nome: registration.nome,
        Email: registration.email,
        Evento: registration.evento,
        Confirmação: isConfirmedPresence(registration.nome, registration.evento) ? 'Confirmado' : 'Pendente',
        Hora: isConfirmedPresence(registration.nome, registration.evento) ? getConfirmationTime(registration.nome, registration.evento) : ''
    }));
    
    // Criar uma planilha do excel com os dados
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    
    // Corrigido: Usando a função correta
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    
    // Gerar o arquivo Excel e iniciar o download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}


// Função para verificar se a presença já foi confirmada
function isConfirmedPresence(nome, evento) {
    const confirmedData = JSON.parse(localStorage.getItem('confirmedPresence')) || [];
    return confirmedData.some(entry => entry.nome === nome && entry.evento === evento);
}

// Função para obter o horário de confirmação
function getConfirmationTime(nome, evento) {
    const confirmedData = JSON.parse(localStorage.getItem('confirmedPresence')) || [];
    const entry = confirmedData.find(entry => entry.nome === nome && entry.evento === evento);
    return entry ? entry.hora : '';
}

// Função para confirmar presença
function confirmPresence(nome, evento) {
    const confirmationTime = new Date().toLocaleString();

    // Armazena a confirmação no localStorage
    let confirmedData = JSON.parse(localStorage.getItem('confirmedPresence')) || [];
    confirmedData.push({ nome, evento, hora: confirmationTime });
    localStorage.setItem('confirmedPresence', JSON.stringify(confirmedData));

    // Atualiza a tabela
    updateTableConfirmation(nome, evento, confirmationTime);
    
    // Recarregar as inscrições do servidor
    loadRegistrations(); // Atualiza a tabela de registros com os dados mais recentes
}

// Função para atualizar a confirmação na tabela
function updateTableConfirmation(nome, evento, hora) {
    const rows = document.querySelectorAll('#tables-container table tbody tr');
    rows.forEach(row => {
        const nameCell = row.cells[1]; // Nome
        const eventCell = row.cells[3]; // Evento

        if (nameCell.textContent === nome && eventCell.textContent === evento) {
            row.cells[4].textContent = 'Confirmado';
            row.cells[5].textContent = hora;
            row.classList.add('confirmed');
        }
    });
}

