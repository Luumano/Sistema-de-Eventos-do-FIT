document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const eventosLista = document.getElementById("eventos");


    // Função para carregar eventos da base de dados
    async function carregarEventos(){
        try{
             const response = await fetch("./conexao/listar_eventos.php");
             const eventos = await response.json();

             eventosLista.innerHTML = ""; // Limpar a lista
        
            // Adiciona os eventos na lista
            eventos.forEach(evento => {
                const li = document.createElement("li");
                li.textContent = evento.nome;
                li.dataset.eventoId = evento.id;
                li.addEventListener("click", () => carregarEventosParaEdicao(evento.id));
                eventosLista.appendChild(li);
            });
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            alert("Erro ao carregar a lista de eventos.");
        }
    }

    // Função para carregar os dados do evento para o formulário
    async function carregarEventosParaEdicao(id) {
        try{
            const response = await fetch(`./conexao/obter_eventos.php?id=${id}`);
            const evento = await response.json();
        
            document.querySelector('input[name="id"]').value = evento.id;
            document.getElementById("nome").value = evento.nome;
            document.getElementById("titulo").value = evento.titulo;
            document.getElementById("nome-palestrante").value = evento.palestrante;
            document.getElementById("resumo").value = evento.resumo;
            document.getElementById("local").value = evento.local;
            document.getElementById("data").value = evento.data;
            document.getElementById("horario").value = evento.horario;
            document.getElementById("periodo").value = evento.periodo;
        } catch (error){
            console.error("Erro ao carregar evento:", error);
            alert("Erro ao carregar os dados do evento.");
        }
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Cria um objeto FormData para os dados do formulário
        const formData = new FormData(form);

        try{
            const response = await fetch("./conexao/editar_eventos.php", {
                method: "POST",
                body: formData
            });
            
            const result = await response.json();

            if(result.success){
                alert("Evento atualizado com sucesso!");
                window.location.href = "editar_eventos.html" // Redireciona após o sucesso
            } else {
                alert("Erro ao atualizar evento: " + result.message);
            }
        } catch (error){
            console.error("Erro:", error);
            alert("Ocorreu um erro ao tentar atualizar o evento.");
        }
    });

        // Carrega os eventos ao inicializar a página
        carregarEventos();
});