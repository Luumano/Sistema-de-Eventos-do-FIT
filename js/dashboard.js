async function loadInstitutions() {
    try {
        const response = await fetch("./conexao/fetch_instituicao.php");

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const registrations = await response.json();
        console.log('Dados retornados:', registrations); // Verifique os dados retornados aqui

        if (registrations.error) {
            alert(registrations.error);
            return;
        }

        // Verificar se os dados possuem a propriedade 'instituicao'
        if (!Array.isArray(registrations)) {
            console.error("Os dados de instituições não estão no formato esperado.");
            return;
        }

        institutionsRegisteredChart(registrations);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}



async function loadDashboardData(){
    try{
        const response = await fetch('./conexao/fetch_registrations.php');
        const registrations = await response.json();

        if(registrations.error){
            alert(registrations.error);
            return;
        }

        renderFeedbacks(registrations);
        renderGeneralChart(registrations);
        renderStudentsPassedChart(registrations);
        renderInstitutionsChart(registrations);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

// Função para renderizar o gráfico de inscrições e confirmações por evento
function renderGeneralChart(data) {
    const eventNames = data.map(item => item.evento);  // Nomes dos eventos
    const totalRegistrations = data.map(item => item.total);  // Total de inscritos
    const totalConfirmed = data.map(item => item.confirmed);  // Total de confirmados

    const ctx = document.getElementById('generalChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eventNames,
            datasets: [
                { label: 'Inscritos', data: totalRegistrations, backgroundColor: '#36A2EB'},
                { label: 'Confirmados', data: totalConfirmed, backgroundColor: '#4BC0C0'}
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


// Função para exibir feedbacks no painel
function renderFeedbacks(data){
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = "";

    data.forEach((item) => {
        const feedbackDiv = document.createElement("div");
        feedbackDiv.className = "feedback-item";
        
        //Verificar se o campo 'confirmação' é 'confirmado' ou 'não confirmado'
        const confirmationStatus = item.confirmacao === 'Confirmado' ? 'Confirmado' : 'Não Confirmado';
        
        feedbackDiv.innerHTML = `<strong>${item.nome}</strong> (${item.email}): ${item.evento} - ${confirmationStatus}`;
        feedbackContainer.appendChild(feedbackDiv);
    });
}

// Função para renderizar o gráfico de alunos confirmados
function renderStudentsPassedChart(data) {
    const eventNames = data.map(item => item.evento);
    const studentsPassed = data.map(item => item.confirmed); // Aqui pega a quantidade de confirmados

    const ctx = document.getElementById('studentsPassedChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eventNames,
            datasets: [{
                label: 'Alunos que passaram no Evento',
                data: studentsPassed,
                backgroundColor: '#FF6384', 
                borderColor: '#FF6384',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function institutionsRegisteredChart(data) {
    const normalizeName = (name) => {
        if (!name) return "Desconhecido";
        return name
            .trim() // Remove espaços extras nas extremidades
            .replace(/\s+/g, " ") // Substitui múltiplos espaços por um único espaço
    };
    
    const institutions = data.reduce((acc, item) => {
        const institutionName = normalizeName(item.nome);
        acc[institutionName] = (acc[institutionName] || 0) + item.registered_count;
        return acc;
    }, {});

    const institutionNames = Object.keys(institutions);
    const institutionCounts = institutionNames.map(name => institutions[name]);

    // Ordenando os dados do maior para o menor
    const sortedData = institutionNames
        .map((name, index) => ({ name, count: institutionCounts[index] })) // Cria um array de objetos com nome e contagem
        .sort((a, b) => b.count - a.count); // Ordena por contagem em ordem decrescente

    // Separando novamente em dois arrays após a ordenação
    const sortedInstitutionNames = sortedData.map(item => item.name);
    const sortedInstitutionCounts = sortedData.map(item => item.count);

    const ctx = document.getElementById('institutionsRegisteredChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Usando 'bar' para barras horizontais
        data: {
            labels: sortedInstitutionNames, // Usando os nomes das instituições no eixo X
            datasets: [{
                label: 'Quantidade de Alunos Cadastrados',
                data: sortedInstitutionCounts, // Usando as contagens de alunos cadastrados
                backgroundColor: '#02416d',
                borderColor: '#02416d',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Alunos Cadastrados por Instituição',
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#000',
                    formatter: (value) => value // Exibir o número de alunos no final da barra
                },
            },
            scales: {
                x: {
                    beginAtZero: true, // Garantir que o eixo X comece do zero
                    title: {
                        display: true,
                        text: 'Numeros de Alunos cadastrados', // Nome do eixo X
                    },
                    ticks: {
                        // Aqui, colocamos a rotação para que o nome da instituição se ajuste se for longo
                        autoSkip: false,
                        maxRotation: 90, // Limite de rotação para evitar sobreposição
                        minRotation: 45, // Ajuste do ângulo da rotação
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nome das Instituições', // Nome do eixo Y
                    },
                },
            },
        },
        plugins: [ChartDataLabels], // Habilitando o plugin para exibir os rótulos
    });
}

function renderInstitutionsChart(data) {
    const institutionNames = data.map(item => item.nome);  // Nomes das instituições
    const institutionCounts = data.map(item => item.confirmed_count);  // Contagem de confirmados por instituição

    // Verificar se os dados foram processados corretamente
    console.log("Instituições:", institutionNames);
    console.log("Confirmados:", institutionCounts);

    const ctx = document.getElementById('institutionsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: institutionNames,  // Nomes das instituições
            datasets: [{
                label: 'Quantidade de Alunos Confirmados',  // Legenda do gráfico
                data: institutionCounts,  // Dados de confirmados
                backgroundColor: '#02416d',  // Cor de fundo para cada barra
                borderColor: '#02416d',  // Cor da borda
                borderWidth: 1  // Largura da borda
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }  // Começar o eixo Y do gráfico no zero
            }
        }
    });
}


//Função para carregar as mensagens dos usuários
async function loadMessages(){
    try{
        const response = await fetch("./conexao/get_messages.php");
        const messages = await response.json();

        const messagesBody = document.getElementById("messages-body");
        messagesBody.innerHTML = "";

        messages.forEach((message) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${message.mensagens}</td>
                <td class="response-field">
                <textarea placeholder="Digite sua resposta..." rows="2"></textarea>
                <button onclick="sendResponse('${message.id}', this)">Responder</button>
                </td>
            `;

            messagesBody.appendChild(row);
        });
    } catch (error){
        console.error("Erro ao carregar mensagens:", error);
    }
}

//Fuunção para enviar resposta a uma mensagem específica
async function sendResponse(messageId, buttonElement){
    const responseField = buttonElement.previousElementSibling;
    const responseText = responseField.value;

    if(!responseText){
        alert("Por favor, digite uma resposta antes de enviar.");
        return;
    }

    try{
        const response = await fetch("./conexao/send_response.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: messageId, response: responseText}),
        });

        const result = await response.json();
        if(result.success){
            alert("Resposta enviada com sucesso!");
            responseField.value = ""; // Limpar campo de resposta
        } else {
            alert("Erro ao enviar resposta.");
        }
    } catch (error) {
        console.error("Erro ao enviar resposta:", error);
    }
}

// Função para criar o gráfico a partir do JSON local
function renderSchoolPassChart(data) {
 const schoolNames = data.map(item => item.escola); // Nomes das escolas
    const totalRegistrations = data.map(item => item.inscritos); // Inscritos no evento
    const totalConfirmed = data.map(item => item.confirmados); // Confirmados no evento

    const ctx = document.getElementById('schoolPassChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (barras horizontais)
        data: {
            labels: schoolNames, // Nomes das escolas
            datasets: [
                {
                    label: 'Inscritos',
                    data: totalRegistrations, // Total de inscritos
                    backgroundColor: '#36A2EB',
                    borderWidth: 1, // Largura da borda
                },
                {
                    label: 'Confirmados',
                    data: totalConfirmed, // Total de confirmados
                    backgroundColor: '#4BC0C0',
                    borderWidth: 1, // Largura da borda
                }
            ],
        },
        options: {
            responsive: true,
            indexAxis: 'y', // Tornar as barras horizontais
            plugins: {
                legend: {
                    display: true, // Exibir legenda
                },
                title: {
                    display: true, // Exibir título
                    text: 'Inscrições e Confirmações nos eventos', // Título do gráfico
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#000', // Cor do texto dos rótulos
                    formatter: (value) => value, // Exibir o número de alunos
                },
            },
            scales: {
                x: {
                    beginAtZero: true, // Garantir que o eixo X comece do zero
                    title: {
                        display: true, // Exibir o título do eixo X
                        text: 'Número de Inscritos e Confirmados', // Nome do eixo X
                    },
                },
                y: {
                    beginAtZero: true, // Garantir que o eixo Y comece do zero
                    title: {
                        display: true, // Exibir o título do eixo Y
                        text: 'Instituições', // Nome do eixo Y
                    },
                },
            },
        },
        plugins: [ChartDataLabels], // Habilitar o plugin para exibir rótulos
    });
}

// JSON local com os dados das escolas
const schoolData = [
    { escola: "Abertura", inscritos: 113, confirmados: 41 },
    { escola: "Teoria", inscritos: 268, confirmados: 134 },
    { escola: "Criptografia", inscritos: 184, confirmados: 117 },
    { escola: "Momento SEBRAE", inscritos: 117, confirmados: 52 },
    { escola: "DevOps", inscritos: 197, confirmados: 122 },
    { escola: "Engenharia de Prompt", inscritos: 128, confirmados: 60 },
    { escola: "Robotica", inscritos: 115, confirmados: 40 },
    { escola: "Engenharia Social", inscritos: 83, confirmados: 35},
]; 

        // Registrar o plugin de rótulos
        Chart.register(ChartDataLabels);

        // Função para criar o gráfico com dados de dois dias
        function renderSchoolPassChart2(data) {
            const schoolNames = data.map(item => item.escola); // Nomes das escolas
            const firstDayData = data.map(item => item.primeiroDia); // Dados do primeiro dia
            const secondDayData = data.map(item => item.segundoDia); // Dados do segundo dia

            const ctx = document.getElementById('schoolPassChart2').getContext('2d');
            new Chart(ctx, {
                type: 'bar', // Tipo de gráfico (barras horizontais)
                data: {
                    labels: schoolNames, // Nomes das escolas
                    datasets: [
                        {
                            label: 'Primeiro Dia',
                            data: firstDayData,
                            backgroundColor: '#02416d', // Cor das barras do primeiro dia
                        },
                        {
                            label: 'Segundo Dia',
                            data: secondDayData,
                            backgroundColor: '#028f77', // Cor das barras do segundo dia
                        },
                    ],
                },
                options: {
                    responsive: true,
                    indexAxis: 'y', // Tornar as barras horizontais
                    plugins: {
                        legend: {
                            display: true, // Exibir legenda
                        },
                        title: {
                            display: true, // Exibir título
                            text: 'Alunos que Passaram no Evento', // Título do gráfico
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: '#000', // Cor do texto dos rótulos
                            formatter: (value) => value, // Exibir o número de alunos
                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true, // Garantir que o eixo X comece do zero
                            title: {
                                display: true, // Exibir o título do eixo X
                                text: 'Número de Alunos Cadastrados', // Nome do eixo X
                            },
                        },
                        y: {
                            title: {
                                display: true, // Exibir o título do eixo Y
                                text: 'Nome das Instituições', // Nome do eixo Y
                            },
                        },
                    },
                },
            });
        }

        // JSON local com os dados das escolas para dois dias
        const schoolData2 = [
            { escola: "EP Manoel Mano", primeiroDia: 20, segundoDia: 20 },
            { escola: "FPO ", primeiroDia: 28, segundoDia: 28 },
            { escola: "EEMTI Lions Clube", primeiroDia: 40, segundoDia: 40 },
            { escola: "EEMTI Presidente Eurico Gaspar Dutra", primeiroDia: 40, segundoDia: 40 },
            { escola: "EEMTI Regina Pacis", primeiroDia: 30, segundoDia: 0 },
            { escola: "EP Maria Eudes Bezerra Veras", primeiroDia: 0, segundoDia: 40 },
            { escola: "Escola Estadual de Educação Profissional Dario Catunda Fontenele", primeiroDia: 87, segundoDia: 87 },
            { escola: "EP Maria Altair Américo Saboia", primeiroDia: 46, segundoDia: 0 },
        ];

        // Função para carregar e renderizar o gráfico ao carregar a página
        document.addEventListener('DOMContentLoaded', () => {
            renderSchoolPassChart2(schoolData2);
        });


// Função para carregar e renderizar o gráfico ao carregar a página
function loadLocalDataAndRenderChart() {
    renderSchoolPassChart(schoolData); // Renderizar gráfico com JSON local
}


// Adicionar evento para carregar o gráfico ao carregar a página
document.addEventListener('DOMContentLoaded', loadLocalDataAndRenderChart);


// Função para carregar os dados e renderizar o gráfico
function loadLocalDataAndRenderChart() {
    renderSchoolPassChart(schoolData); // Passar o JSON local para a função
}

// Adicionar evento para carregar o gráfico ao carregar a página
document.addEventListener('DOMContentLoaded', loadLocalDataAndRenderChart);


window.addEventListener("load", loadInstitutions);

// Carregar as mensagens quando a página carregar
window.addEventListener("load", loadMessages);

// Carregar dados ao iniciar a Dashboard
document.addEventListener('DOMContentLoaded', loadDashboardData);