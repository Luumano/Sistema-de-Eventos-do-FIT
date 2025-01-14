<?php
    session_start();

    // Destruir todas as variáveis de sessão
    $_SESSION = array();

    // Caso em destruir completamente a sessão, excluir também o cookie da sessão.
    // Nota: Isso destruirá a sessão e não apenas os dados da sessão.
    if(ini_get("session.use_cookies")){
        $params = session_get_cookie_params();
        setcookie(session_name(), '',time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
        );
    }

    // Destruir a sessão.
    session_destroy();

    // Redirecionar para a página de login
    header("Location: index.html");
    exit();
?>