document.addEventListener("DOMContentLoaded", function(){
    // Função para buscar os dados do usuário
    function carregarDadosUsuario(){
        fetch('./conexao/editarDados.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    //Preencher os campos com os dados do usuário
                    document.getElementById('nome').value = data.user.nome || '';
                    document.getElementById('email').value = data.user.email || '';
                    document.getElementById('curso').value = data.user.curso || '';
                    // Não prencher a senha por motivos de segurança
                } else {
                    console.error('Erro ao carregar os dados do usuário');
                    alert('Não foi possível carregar seus dados.');
                }
            })
            .catch(error => {
                console.error('Erro de conexão', error);
                alert('Erro ao tentar carregar os dados do usuário.');
            });
    }

    // Carregar os dados do usuário assim que a página for carregada
    carregarDadosUsuario();
});