document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de Navegação ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const inputBusca = document.querySelector('.search-bar input');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Ativa o item no menu
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Atualiza o título e troca a seção
            pageTitle.innerText = item.innerText;
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) section.classList.add('active');
            });

            // Limpa a busca ao trocar de aba para não bugar a visualização
            if (inputBusca) {
                inputBusca.value = '';
                resetarFiltros();
            }
        });
    });

    // --- Lógica de Cálculos (Painel - Previstos) ---
    const atualizarCalculosPainel = () => {
        const celulasValor = document.querySelectorAll('.valor-servico');
        const displayTotal = document.getElementById('ganho-total');
        let totalSoma = 0;

        celulasValor.forEach(celula => {
            const valorNumerico = parseFloat(celula.innerText.replace('R$', '').replace('.', '').replace(',', '.'));
            if (!isNaN(valorNumerico)) {
                totalSoma += valorNumerico;
                celula.innerText = valorNumerico.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                });
            }
        });

        if (displayTotal) {
            displayTotal.innerText = totalSoma.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            });
        }
    };

    // --- Lógica de Cálculos (Serviços - Concluídos) ---
    const atualizarResumoConcluidos = () => {
        const linhasConcluidas = document.querySelectorAll('#tabela-concluidos tr');
        const valoresConcluidos = document.querySelectorAll('.valor-concluido');
        const displayQtd = document.getElementById('total-concluidos-qtd');
        const displayValor = document.getElementById('total-recebido-valor');

        let somaTotal = 0;
        let quantidade = linhasConcluidas.length;

        valoresConcluidos.forEach(celula => {
            const valor = parseFloat(celula.innerText.replace('R$', '').replace('.', '').replace(',', '.'));
            if (!isNaN(valor)) {
                somaTotal += valor;
                celula.innerText = valor.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                });
            }
        });

        if (displayQtd) displayQtd.innerText = quantidade.toString().padStart(2, '0');
        if (displayValor) {
            displayValor.innerText = somaTotal.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            });
        }
    };

    // --- Lógica de Filtro (Busca) ---
    if (inputBusca) {
        inputBusca.addEventListener('input', () => {
            const termoBusca = inputBusca.value.toLowerCase();
            const secaoAtiva = document.querySelector('.tab-content.active');
            const idAtivo = secaoAtiva.id;

            if (idAtivo === 'painel' || idAtivo === 'servicos') {
                // Filtra linhas das tabelas
                const linhas = secaoAtiva.querySelectorAll('tbody tr');
                linhas.forEach(linha => {
                    const textoLinha = linha.innerText.toLowerCase();
                    linha.style.display = textoLinha.includes(termoBusca) ? '' : 'none';
                });
            } else if (idAtivo === 'mensagens') {
                // Filtra cards de mensagens
                const cardsMensagem = secaoAtiva.querySelectorAll('.chat-card');
                cardsMensagem.forEach(card => {
                    const conteudoChat = card.innerText.toLowerCase();
                    card.style.display = conteudoChat.includes(termoBusca) ? 'flex' : 'none';
                });
            }
        });
    }

    function resetarFiltros() {
        document.querySelectorAll('tr, .chat-card').forEach(el => el.style.display = '');
    }

    // --- Data Atual ---
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.innerText = new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        });
    }

    // Executa os cálculos iniciais
    atualizarCalculosPainel();
    atualizarResumoConcluidos();
});

// Função para o botão Sair via JS
function fazerLogout() {
    // Se quiser um efeito de confirmação antes:
    if(confirm("Deseja realmente sair do sistema?")) {
        window.location.href = "login.html";
    }
}

function enviarMensagem() {
    // 1. Pega o campo de texto pelo ID que colocamos ali em cima
    const input = document.getElementById('chat-input-field');
    const corpoChat = document.getElementById('chat-mensagens-corpo');
    
    // 2. Verifica se o usuário não digitou apenas espaços
    if (input.value.trim() !== "") {
        // 3. Cria a bolha da nova mensagem
        const novaMsg = document.createElement('div');
        novaMsg.className = 'bubble sent'; // 'sent' para ficar na direita (azul)
        novaMsg.innerText = input.value;
        
        // 4. Adiciona no chat e limpa o campo
        corpoChat.appendChild(novaMsg);
        const mensagemTexto = input.value; // guarda para log se precisar
        input.value = ""; 
        
        // 5. Faz o chat rolar para baixo automaticamente
        corpoChat.scrollTop = corpoChat.scrollHeight;

        // Opcional: Simular uma resposta automática após 1 segundo
        setTimeout(() => {
            const resposta = document.createElement('div');
            resposta.className = 'bubble received';
            resposta.innerText = "Beleza! Recebi sua mensagem: " + mensagemTexto;
            corpoChat.appendChild(resposta);
            corpoChat.scrollTop = corpoChat.scrollHeight;
        }, 1000);
    }
}

// Função para abrir o chat ao clicar no contato
function abrirChat(nome) {
    const lista = document.getElementById('lista-conversas');
    const janela = document.getElementById('janela-chat');
    
    if (lista && janela) {
        lista.style.display = 'none'; // Esconde a lista
        janela.style.setProperty('display', 'flex', 'important'); // Força o chat a aparecer como flex
        
        document.getElementById('chat-nome-usuario').innerText = nome;
        
        // Limpa e coloca mensagens de exemplo
        const corpoChat = document.getElementById('chat-mensagens-corpo');
        corpoChat.innerHTML = `
            <div class="bubble received">Salve! Aqui é o ${nome}.</div>
            <div class="bubble sent">Opa, beleza?</div>
        `;
        corpoChat.scrollTop = corpoChat.scrollHeight;
    }
}

// Função para voltar à lista de contatos
function voltarParaLista() {
    const lista = document.getElementById('lista-conversas');
    const janela = document.getElementById('janela-chat');
    
    if (lista && janela) {
        janela.style.setProperty('display', 'none', 'important'); // Esconde o chat
        lista.style.display = 'block'; // Mostra a lista de volta
    }
}

function enviarMensagem() {
    // 1. Pega o campo de texto pelo ID que colocamos ali em cima
    const input = document.getElementById('chat-input-field');
    const corpoChat = document.getElementById('chat-mensagens-corpo');
    
    // 2. Verifica se o usuário não digitou apenas espaços
    if (input.value.trim() !== "") {
        // 3. Cria a bolha da nova mensagem
        const novaMsg = document.createElement('div');
        novaMsg.className = 'bubble sent'; // 'sent' para ficar na direita (azul)
        novaMsg.innerText = input.value;
        
        // 4. Adiciona no chat e limpa o campo
        corpoChat.appendChild(novaMsg);
        const mensagemTexto = input.value; // guarda para log se precisar
        input.value = ""; 
        
        // 5. Faz o chat rolar para baixo automaticamente
        corpoChat.scrollTop = corpoChat.scrollHeight;

        // Opcional: Simular uma resposta automática após 1 segundo
        setTimeout(() => {
            const resposta = document.createElement('div');
            resposta.className = 'bubble received';
            resposta.innerText = "Beleza! Recebi sua mensagem: " + mensagemTexto;
            corpoChat.appendChild(resposta);
            corpoChat.scrollTop = corpoChat.scrollHeight;
        }, 1000);
    }
}

// Bônus: Fazer o 'Enter' do teclado também enviar a mensagem
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const inputAtivo = document.activeElement;
        if (inputAtivo.id === 'chat-input-field') {
            enviarMensagem();
        }
    }
});