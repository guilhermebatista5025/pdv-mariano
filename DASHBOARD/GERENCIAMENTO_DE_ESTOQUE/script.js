// ==================================================================
// REFRICONTROL — script.js
// Versão com todas as melhorias aplicadas:
//   ✅ localStorage (dados não somem ao recarregar)
//   ✅ Toast de feedback (confirmações visuais)
//   ✅ Botão excluir com confirmação
//   ✅ Botão editar (modal reutilizável)
//   ✅ Busca em tempo real por nome e categoria
//   ✅ Gráfico real com Chart.js
//   ✅ Estado vazio quando não há produtos
//   ✅ Alerta de estoque mínimo com badge no painel
//   ✅ Responsividade com botão hambúrguer
// ==================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------------------------
    // 1. SELEÇÃO DE ELEMENTOS DO DOM
    // ------------------------------------------------------------------
    const navItems       = document.querySelectorAll('.nav-item');
    const sections       = document.querySelectorAll('.tab-content');
    const btnAbrirModal  = document.getElementById('btnAbrirModal');
    const btnFechar      = document.getElementById('btnFechar');
    const modal          = document.getElementById('modal');
    const btnSalvar      = document.getElementById('btnSalvar');
    const btnExportar    = document.getElementById('btnExportarPDF');
    const listaProdutos  = document.getElementById('lista-produtos');
    const listaRelatorio = document.getElementById('lista-relatorio');
    const campoBusca     = document.getElementById('campoBusca');
    const estadoVazio    = document.getElementById('estado-vazio');
    const modalTitulo    = document.getElementById('modal-titulo');

    // ------------------------------------------------------------------
    // 2. BANCO DE DADOS COM LOCALSTORAGE
    // Tenta carregar dados salvos. Se não houver nada, usa os dados iniciais.
    // ------------------------------------------------------------------

    // Dados iniciais de exemplo (só usados na primeira vez)
    const dadosIniciais = [
        { nome: 'Gás R134a (13.6kg)',      cat: 'Fluidos', custo: 300, markup: 50, qtd: 2,  minimo: 5  },
        { nome: 'Compressor Embraco 1/4',  cat: 'Peças',   custo: 280, markup: 40, qtd: 10, minimo: 3  },
        { nome: 'Filtro Secador 3/8',      cat: 'Peças',   custo: 45,  markup: 60, qtd: 30, minimo: 10 },
        { nome: 'Termostato Universal',    cat: 'Elétrica', custo: 38,  markup: 55, qtd: 1,  minimo: 5  },
    ];

    // Carrega do localStorage ou usa os dados iniciais
    let estoque = carregarEstoque();

    function carregarEstoque() {
        const salvo = localStorage.getItem('refricontrol_estoque');
        // Se existir algo salvo, usa; caso contrário, retorna os dados iniciais
        return salvo ? JSON.parse(salvo) : dadosIniciais;
    }

    function salvarEstoque() {
        // Sempre que o estoque mudar, salva no localStorage como texto JSON
        localStorage.setItem('refricontrol_estoque', JSON.stringify(estoque));
    }


    // ------------------------------------------------------------------
    // 3. TOAST DE NOTIFICAÇÃO
    // Exibe uma mensagem temporária no canto da tela
    // tipo: 'sucesso' (verde) | 'erro' (vermelho) | 'aviso' (amarelo)
    // ------------------------------------------------------------------
    function mostrarToast(mensagem, tipo = 'sucesso') {
        const toast = document.getElementById('toast');

        // Remove classes anteriores para não acumular estilos
        toast.className = `toast ${tipo}`;
        toast.textContent = mensagem;
        toast.style.display = 'block';

        // Esconde o toast automaticamente após 3 segundos
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }


    // ------------------------------------------------------------------
    // 4. CONTROLE DO MODAL (ABRIR / FECHAR)
    // O índice editando controla se estamos criando (null) ou editando (índice)
    // ------------------------------------------------------------------
    let indiceEditando = null; // null = novo produto | número = editar produto existente

    const abrirModal = (indice = null) => {
        indiceEditando = indice;

        if (indice !== null) {
            // MODO EDIÇÃO: preenche os campos com os dados do produto selecionado
            const prod = estoque[indice];
            modalTitulo.textContent = 'Editar Produto';
            document.getElementById('nome').value         = prod.nome;
            document.getElementById('categoria').value    = prod.cat;
            document.getElementById('custo').value        = prod.custo;
            document.getElementById('markup').value       = prod.markup;
            document.getElementById('estoque-input').value = prod.qtd;
            document.getElementById('minimo').value       = prod.minimo || 0;
        } else {
            // MODO CADASTRO: limpa os campos e muda o título
            modalTitulo.textContent = 'Cadastrar Produto';
            limparCamposModal();
        }

        modal.style.display = 'flex';
    };

    const fecharModal = () => {
        modal.style.display = 'none';
        indiceEditando = null;
        limparCamposModal();
    };

    const limparCamposModal = () => {
        // Limpa todos os inputs dentro do modal de uma só vez
        document.querySelectorAll('#modal input').forEach(input => input.value = '');
    };

    // Fecha o modal ao clicar no fundo escuro (fora da caixa branca)
    window.onclick = (event) => {
        if (event.target === modal) fecharModal();
    };


    // ------------------------------------------------------------------
    // 5. NAVEGAÇÃO ENTRE ABAS
    // ------------------------------------------------------------------
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');

            // Remove "active" de todos e adiciona apenas no item clicado
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === target) sec.classList.add('active');
            });

            // Fecha o menu mobile ao navegar (responsividade)
            document.querySelector('.sidebar').classList.remove('aberta');
        });
    });


    // ------------------------------------------------------------------
    // 6. BUSCA EM TEMPO REAL
    // Filtra as linhas da tabela conforme o usuário digita
    // ------------------------------------------------------------------
    campoBusca.addEventListener('input', () => {
        const termo = campoBusca.value.toLowerCase().trim();
        const linhas = listaProdutos.querySelectorAll('tr');

        linhas.forEach(linha => {
            // Pega o texto da linha toda (nome + categoria + etc.)
            const textoLinha = linha.textContent.toLowerCase();
            // Mostra ou esconde a linha com base na busca
            linha.style.display = textoLinha.includes(termo) ? '' : 'none';
        });
    });


    // ------------------------------------------------------------------
    // 7. GRÁFICO DE CATEGORIAS (Chart.js)
    // Substitui o círculo CSS estático por um gráfico real
    // ------------------------------------------------------------------
    let graficoInstance = null; // Guarda a instância para poder destruir e recriar

    const coresCategorias = [
        '#1a3a5a', '#f39200', '#496b8e', '#15803d',
        '#b91c1c', '#7c3aed', '#0891b2', '#d97706'
    ];

    function renderizarGrafico() {
        const canvas = document.getElementById('grafico-categorias');
        if (!canvas) return;

        // Conta quantos produtos há em cada categoria
        const contagem = {};
        estoque.forEach(prod => {
            contagem[prod.cat] = (contagem[prod.cat] || 0) + prod.qtd;
        });

        const labels = Object.keys(contagem);
        const dados  = Object.values(contagem);

        // Se já existe um gráfico, destrói antes de criar o novo
        // (evita gráficos duplicados ao atualizar o estoque)
        if (graficoInstance) graficoInstance.destroy();

        graficoInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: dados,
                    backgroundColor: coresCategorias.slice(0, labels.length),
                    borderWidth: 3,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Vamos usar nossa própria legenda HTML
                },
                cutout: '65%' // Espessura do anel do gráfico
            }
        });

        // Gera a legenda HTML personalizada abaixo do gráfico
        const legendaDiv = document.getElementById('legenda-categorias');
        legendaDiv.innerHTML = labels.map((label, i) => `
            <div class="legend-item">
                <span class="legend-dot" style="background:${coresCategorias[i]}"></span>
                <span>${label}: <strong>${dados[i]}</strong></span>
            </div>
        `).join('');
    }


    // ------------------------------------------------------------------
    // 8. RENDERIZAÇÃO PRINCIPAL
    // Redesenha a tabela, os cards do painel e os relatórios
    // ------------------------------------------------------------------
    const renderizar = () => {
        listaProdutos.innerHTML = '';
        if (listaRelatorio) listaRelatorio.innerHTML = '';

        let lucroTotal      = 0;
        let custoTotal      = 0;
        let faturamentoBruto = 0;
        let totalAlertas    = 0; // Contador de produtos abaixo do estoque mínimo

        estoque.forEach((prod, indice) => {
            const lucroUnitario  = prod.custo * (prod.markup / 100);
            const precoVenda     = prod.custo + lucroUnitario;
            const lucroTotalProd = lucroUnitario * prod.qtd;
            const custoTotalProd = prod.custo * prod.qtd;
            const faturamentoProd = precoVenda * prod.qtd;

            lucroTotal       += lucroTotalProd;
            custoTotal       += custoTotalProd;
            faturamentoBruto += faturamentoProd;

            // Define o status e a classe CSS com base na quantidade
            let statusTxt = 'Em Estoque';
            let statusCls = 'in-stock';

            if (prod.qtd <= 0) {
                statusTxt = 'Em Falta';
                statusCls = 'out-of-stock';
            } else if (prod.qtd <= 5) {
                statusTxt = 'Baixo Estoque';
                statusCls = 'low-stock';
            }

            // Verifica se está abaixo do mínimo definido pelo usuário
            const estaAbaixoDoMinimo = prod.minimo && prod.qtd < prod.minimo;
            if (estaAbaixoDoMinimo) totalAlertas++;

            // Cria a linha da tabela de estoque
            const trEstoque = document.createElement('tr');

            // Adiciona classe de alerta visual se abaixo do mínimo
            if (estaAbaixoDoMinimo) trEstoque.classList.add('linha-alerta');

            trEstoque.innerHTML = `
                <td>${prod.nome}</td>
                <td>${prod.cat}</td>
                <td>${prod.qtd}</td>
                <td><span class="status ${statusCls}">${statusTxt}</span></td>
                <td>${precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>
                    <!-- Botão editar: abre o modal preenchido com os dados deste produto -->
                    <button class="btn-acao editar" title="Editar produto" onclick="editarProduto(${indice})">✏️</button>
                    <!-- Botão excluir: pede confirmação antes de deletar -->
                    <button class="btn-acao excluir" title="Excluir produto" onclick="excluirProduto(${indice})">🗑️</button>
                </td>
            `;
            listaProdutos.appendChild(trEstoque);

            // Cria a linha da tabela de relatórios
            if (listaRelatorio) {
                const trRel = document.createElement('tr');
                trRel.innerHTML = `
                    <td><strong>${prod.nome}</strong></td>
                    <td>${prod.qtd} un.</td>
                    <td>${custoTotalProd.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td><span style="color: #15803d; font-weight: bold;">${prod.markup}%</span></td>
                    <td>${lucroTotalProd.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                `;
                listaRelatorio.appendChild(trRel);
            }
        });

        // --- Atualiza os cards do Painel ---
        document.getElementById('ganho-total').innerText =
            lucroTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('total-custo-painel').innerText =
            custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('total-venda-painel').innerText =
            faturamentoBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Mostra ou esconde o card de alertas dependendo se há produtos em alerta
        const cardAlerta = document.getElementById('card-alerta-wrapper');
        const qtdAlerta  = document.getElementById('alerta-qtd');
        if (cardAlerta && qtdAlerta) {
            qtdAlerta.innerText = totalAlertas;
            cardAlerta.style.display = totalAlertas > 0 ? 'block' : 'none';
        }

        // --- Atualiza os números da seção Relatórios ---
        if (document.getElementById('rel-faturamento')) {
            document.getElementById('rel-faturamento').innerText =
                faturamentoBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('rel-investimento').innerText =
                custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('rel-lucro').innerText =
                lucroTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        // Mostra o estado vazio se não houver produtos
        if (estadoVazio) {
            estadoVazio.style.display = estoque.length === 0 ? 'block' : 'none';
        }

        // Atualiza o gráfico com os dados mais recentes
        renderizarGrafico();
    };


    // ------------------------------------------------------------------
    // 9. SALVAR PRODUTO (CRIAR OU EDITAR)
    // ------------------------------------------------------------------
    btnSalvar.addEventListener('click', () => {
        const nome   = document.getElementById('nome').value.trim();
        const cat    = document.getElementById('categoria').value.trim();
        const custo  = parseFloat(document.getElementById('custo').value);
        const markup = parseFloat(document.getElementById('markup').value);
        const qtd    = parseInt(document.getElementById('estoque-input').value);
        const minimo = parseInt(document.getElementById('minimo').value) || 0;

        // Valida se todos os campos obrigatórios foram preenchidos
        if (!nome || !cat || isNaN(custo) || isNaN(markup) || isNaN(qtd)) {
            mostrarToast('⚠️ Preencha todos os campos corretamente!', 'aviso');
            return;
        }

        if (indiceEditando !== null) {
            // MODO EDIÇÃO: atualiza o produto existente no array
            estoque[indiceEditando] = { nome, cat, custo, markup, qtd, minimo };
            mostrarToast('✅ Produto atualizado com sucesso!', 'sucesso');
        } else {
            // MODO CADASTRO: adiciona o novo produto ao array
            estoque.push({ nome, cat, custo, markup, qtd, minimo });
            mostrarToast('✅ Produto cadastrado com sucesso!', 'sucesso');
        }

        salvarEstoque(); // Persiste no localStorage
        renderizar();    // Redesenha a interface
        fecharModal();   // Fecha o modal
    });


    // ------------------------------------------------------------------
    // 10. EDITAR PRODUTO
    // Função global (window) para poder ser chamada pelo onclick do HTML
    // ------------------------------------------------------------------
    window.editarProduto = (indice) => {
        abrirModal(indice); // Abre o modal já preenchido com os dados do produto
    };


    // ------------------------------------------------------------------
    // 11. EXCLUIR PRODUTO
    // Pede confirmação e remove o produto do array
    // ------------------------------------------------------------------
    window.excluirProduto = (indice) => {
        const nomeProduto = estoque[indice].nome;

        // Pede confirmação antes de excluir para evitar acidentes
        const confirmado = confirm(`Tem certeza que deseja excluir "${nomeProduto}"?`);
        if (!confirmado) return;

        estoque.splice(indice, 1); // Remove o produto do array pelo índice
        salvarEstoque();           // Salva o array atualizado no localStorage
        renderizar();              // Redesenha a interface

        mostrarToast(`🗑️ "${nomeProduto}" excluído.`, 'erro');
    };


    // ------------------------------------------------------------------
    // 12. EXPORTAR PDF
    // ------------------------------------------------------------------
    const exportarPDF = () => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Cabeçalho
            doc.setFontSize(18);
            doc.setTextColor(26, 58, 90);
            doc.text("Relatório de Estoque - RefriControl", 14, 20);

            const dataAtual = new Date().toLocaleDateString('pt-BR');
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Gerado em: ${dataAtual}`, 14, 28);

            // Tabela de dados
            const colunas = ["Produto", "Categoria", "Qtd", "Mínimo", "Custo Unit.", "Preço Venda"];
            const linhas = estoque.map(prod => [
                prod.nome,
                prod.cat,
                prod.qtd,
                prod.minimo || '-',
                `R$ ${prod.custo.toFixed(2)}`,
                `R$ ${(prod.custo * (1 + prod.markup / 100)).toFixed(2)}`
            ]);

            doc.autoTable({
                startY: 35,
                head: [colunas],
                body: linhas,
                headStyles: { fillColor: [26, 58, 90] },
                alternateRowStyles: { fillColor: [238, 242, 246] },
            });

            doc.save(`relatorio_${dataAtual.replace(/\//g, '-')}.pdf`);
            mostrarToast('📥 PDF exportado com sucesso!', 'sucesso');

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            mostrarToast('Erro ao gerar o PDF. Veja o console.', 'erro');
        }
    };


    // ------------------------------------------------------------------
    // 13. RESPONSIVIDADE — BOTÃO HAMBÚRGUER (MOBILE)
    // Injeta o botão no topo do conteúdo para abrir/fechar a sidebar
    // ------------------------------------------------------------------
    const btnHamburger = document.createElement('button');
    btnHamburger.className  = 'btn-hamburger';
    btnHamburger.textContent = '☰';
    btnHamburger.title       = 'Abrir menu';

    // Insere o botão no início do conteúdo principal
    const conteudo = document.querySelector('.content');
    conteudo.insertBefore(btnHamburger, conteudo.firstChild);

    btnHamburger.addEventListener('click', () => {
        // Alterna a classe "aberta" na sidebar para mostrar/esconder via CSS
        document.querySelector('.sidebar').classList.toggle('aberta');
    });


    // ------------------------------------------------------------------
    // 14. EVENT LISTENERS — conecta os botões às funções
    // ------------------------------------------------------------------
    btnAbrirModal.addEventListener('click', () => abrirModal());
    btnFechar.addEventListener('click', fecharModal);

    if (btnExportar) {
        btnExportar.addEventListener('click', (e) => {
            e.preventDefault();
            exportarPDF();
        });
    }


    // ------------------------------------------------------------------
    // 15. INICIALIZAÇÃO
    // Renderiza tudo ao carregar a página com os dados do localStorage
    // ------------------------------------------------------------------
    renderizar();

}); // fim DOMContentLoaded

// Abre o modal e renderiza os produtos abaixo do mínimo
function abrirModalAlertas() {
    const produtos = JSON.parse(localStorage.getItem('refricontrol_estoque') || '[]');
    const emAlerta = produtos.filter(p => p.minimo && p.qtd < p.minimo);

    const lista = document.getElementById('lista-alertas');
    lista.innerHTML = emAlerta.map(p => `
        <div class="alerta-item">
            <div>
                <div class="alerta-item-nome">${p.nome}</div>
                <div class="alerta-item-cat">${p.cat}</div>
            </div>
            <div class="alerta-item-qtd">
                <span>${p.qtd} un.</span>
                <small>mínimo: ${p.minimo}</small>
            </div>
        </div>
    `).join('');

    document.getElementById('modal-alertas').classList.add('aberto');
}

// Fecha o modal de alertas
function fecharModalAlertas() {
    document.getElementById('modal-alertas').classList.remove('aberto');
}

// Fecha clicando no fundo escuro
document.getElementById('modal-alertas').addEventListener('click', function(e) {
    if (e.target === this) fecharModalAlertas();
});