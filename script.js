let transacoes = [];
let graficoTransacoes; // Variável para armazenar a instância do gráfico

// Função para criar o gráfico
function criarGrafico() {
    const ctx = document.getElementById('grafico-transacoes').getContext('2d');
    const labels = transacoes.map(transacao => transacao.descricao);
    const debitos = transacoes.map(transacao => transacao.debito);
    const creditos = transacoes.map(transacao => transacao.credito);

    graficoTransacoes = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Débitos',
                    data: debitos,
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Créditos',
                    data: creditos,
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para atualizar o gráfico
function atualizarGrafico() {
    if (graficoTransacoes) {
        graficoTransacoes.destroy(); // Destrói o gráfico anterior
    }
    criarGrafico(); // Cria um novo gráfico
}

// Salvar transações no Local Storage
function salvarTransacoesNoLocalStorage(usuarioLogado) {
    const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes')) || {};
    transacoesSalvas[usuarioLogado] = transacoes;
    localStorage.setItem('transacoes', JSON.stringify(transacoesSalvas));
}

// Carregar transações do Local Storage
function carregarTransacoesDoLocalStorage(usuarioLogado) {
    const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes'));
    if (transacoesSalvas && transacoesSalvas[usuarioLogado]) {
        transacoes = transacoesSalvas[usuarioLogado];
        atualizarListaDeTransacoes();
        atualizarSaldo();
        atualizarGrafico(); // Atualiza o gráfico ao carregar
    }
}

// Atualizar o saldo
function atualizarSaldo() {
    const saldo = transacoes.reduce((acc, transacao) => acc + transacao.credito - transacao.debito, 0);
    document.getElementById('saldo').textContent = saldo.toFixed(2);
}

// Função de validação do formulário
function validarFormulario(descricao, debito, credito) {
    if (!descricao) {
        alert('Por favor, insira uma descrição válida.');
        return false;
    }
    if (debito <= 0 && credito <= 0) {
        alert('Você deve informar um valor para Débito ou Crédito.');
        return false;
    }
    return true;
}

// Função para adicionar ou atualizar transação
function manipularTransacao(id) {
    const descricao = document.getElementById('descricao').value.trim();
    const categoria = document.getElementById('categoria').value;
    const debito = parseFloat(document.getElementById('debito').value) || 0;
    const credito = parseFloat(document.getElementById('credito').value) || 0;

    if (!validarFormulario(descricao, debito, credito)) {
        return; // Se a validação falhar, não prosseguir
    }

    if (id) { // Atualizando transação existente
        const transacao = transacoes.find(transacao => transacao.id === id);
        transacao.descricao = descricao;
        transacao.categoria = categoria;
        transacao.debito = debito;
        transacao.credito = credito;
    } else { // Adicionando nova transação
        const transacao = {
            descricao,
            categoria,
            debito,
            credito,
            id: Date.now() // Usando timestamp como ID
        };
        transacoes.push(transacao);
    }

    atualizarListaDeTransacoes();
    atualizarSaldo();

    const usuarioLogado = localStorage.getItem('usuarioLogado'); 
    salvarTransacoesNoLocalStorage(usuarioLogado);
    atualizarGrafico(); // Atualiza o gráfico após adicionar ou editar
    limparFormulario();
}

// Adicionar nova transação
document.getElementById('adicionar').addEventListener('click', () => manipularTransacao());

// Editar uma transação existente
function editarTransacao(id) {
    const transacao = transacoes.find(transacao => transacao.id === id);
    
    document.getElementById('descricao').value = transacao.descricao;
    document.getElementById('categoria').value = transacao.categoria;
    document.getElementById('debito').value = transacao.debito;
    document.getElementById('credito').value = transacao.credito;

    document.getElementById('adicionar').style.display = 'none';
    document.getElementById('atualizar').style.display = 'block';
    document.getElementById('atualizar').onclick = function () {
        manipularTransacao(id); // Chama a função com o ID para atualizar
    };
}

// Excluir uma transação
function excluirTransacao(id) {
    transacoes = transacoes.filter(transacao => transacao.id !== id);
    atualizarListaDeTransacoes();
    atualizarSaldo();
    
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    salvarTransacoesNoLocalStorage(usuarioLogado);
    atualizarGrafico(); // Atualiza o gráfico após a exclusão
}

// Limpar o formulário
function limparFormulario() {
    document.getElementById('descricao').value = '';
    document.getElementById('categoria').value = 'Alimentação';
    document.getElementById('debito').value = '';
    document.getElementById('credito').value = '';
}

// Atualizar lista de transações no HTML
function atualizarListaDeTransacoes(transacoesFiltradas = transacoes) {
    const lista = document.getElementById('transacoes-lista');
    lista.innerHTML = '';

    transacoesFiltradas.forEach(transacao => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${transacao.descricao}</strong> - ${transacao.categoria} 
            | Débito: R$ ${transacao.debito.toFixed(2)} 
            | Crédito: R$ ${transacao.credito.toFixed(2)}
            <button onclick="editarTransacao(${transacao.id})">Editar</button>
            <button onclick="excluirTransacao(${transacao.id})">Excluir</button>
        `;
        lista.appendChild(li);
    });

    if (transacoesFiltradas.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma transação encontrada.';
        lista.appendChild(li);
    }
}

// Carregar transações do Local Storage ao iniciar a página
window.onload = function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        carregarTransacoesDoLocalStorage(usuarioLogado);
        criarGrafico(); // Cria o gráfico na inicialização
    }
};

// Exportar dados para CSV
function exportarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Descrição,Categoria,Débito,Crédito\n";

    transacoes.forEach(transacao => {
        const row = `${transacao.descricao},${transacao.categoria},${transacao.debito},${transacao.credito}\n`;
        csvContent += row;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transacoes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Adicionar o evento ao botão de exportar
document.getElementById('exportar').addEventListener('click', exportarCSV);

// Evento para pesquisa
document.getElementById('search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredTransacoes = transacoes.filter(transacao => 
        transacao.descricao.toLowerCase().includes(searchTerm) ||
        transacao.categoria.toLowerCase().includes(searchTerm) ||
        transacao.debito.toString().includes(searchTerm) ||
        transacao.credito.toString().includes(searchTerm)
    );
    atualizarListaDeTransacoes(filteredTransacoes);
});
