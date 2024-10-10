document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Pega os usuários do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o usuário existe e se a senha está correta
    const usuarioValido = usuarios.find(usuario => usuario.username === username && usuario.password === password);

    if (usuarioValido) {
        // Armazenar o nome de usuário no localStorage para identificação futura
        localStorage.setItem('usuarioLogado', username);
        // Redireciona para o index.html se o login for bem-sucedido
        window.location.href = 'index.html'; // Certifique-se que o caminho está correto
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});
