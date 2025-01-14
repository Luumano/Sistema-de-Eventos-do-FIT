function userLogin() {
    let identificador = document.getElementById('user-identificador').value;
    let password = document.getElementById('user-password').value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "./conexao/usuarioLogin.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert(xhr.responseText);
                if (xhr.responseText.includes("bem-sucedido")) {
                    // Atualiza o status e armazena no localStorege
                    localStorage.setItem('userLoggedIn', true);
                    updateFooterStatus(true);

                    window.location.href = 'detalhesEventos';
                } else {
                    alert("Login falhou. Verifique suas credenciais.");
                }
            } else {
                alert("Erro ao fazer login. Tente novamente.");
            }
        }
    };
    xhr.send("identificador=" + encodeURIComponent(identificador) + "&password=" + encodeURIComponent(password));
}

// Função para desconectar o usuário
function userLogout(){
    // Remove o item 'userLoggedIn' do localStorage
    localStorage.removeItem('userLoggedIn');

    // Atualiza o status do rodapé para desconectado
    updateFooterStatus(false);

    // Rediciona para a página de login outra página desejada
    window.location.href = 'index';
}

// Função para atualizar o status do rodapé
function updateFooterStatus(isConnected){
    const footer = document.getElementById('status-footer');
    if(isConnected){
        footer.textContent = 'STATUS: CONNECTED';
        footer.classList.remove('disconnected');
        footer.classList.add('connected');
    }else{
        footer.textContent = 'STATUS: DISCONNECTED';
        footer.classList.remove('connected');
        footer.classList.add('disconnected');
    }
}

window.onload = function(){
    // Verifica se o usuário está logado no localStorage
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    
    // Atualiza o status do rodapé para desconectado
    updateFooterStatus(false);
    
}