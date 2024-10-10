document.getElementById('cadastro-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        alert('Preencha todos os campos!');
        return;
    }

    // Pega os usuários do localStorage, se não existir, cria um array vazio
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o usuário já existe
    const usuarioExistente = usuarios.find(usuario => usuario.username === username);

    if (usuarioExistente) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
    } else {
        // Adiciona o novo usuário
        usuarios.push({ username: username, password: password });

        // Salva a lista atualizada no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Exibe a mensagem de sucesso
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('error-message').style.display = 'none';

        // Limpa o formulário
        document.getElementById('cadastro-form').reset();
    }
});
``
