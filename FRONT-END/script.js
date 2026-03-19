// =====================================================
// 1. CONFIGURAÇÕES INICIAIS
// =====================================================
const produtosDB = {
    '1': { nome: 'CAMISETA BASICA', preco: 49.90 },
    '2': { nome: 'CALÇA JEANS', preco: 120.00 },
    '789': { nome: 'COCA COLA 2L', preco: 12.00 }
};

let totalGeral = 0;
let itensCount = 0;
let produtoAtual = null;
let controleProdutos = {};

// =====================================================
// 2. MAPEAMENTO DE ELEMENTOS
// =====================================================
const inputProd = document.getElementById('input-produto');
const inputQtd = document.getElementById('input-qtd');
const inputPreco = document.getElementById('input-preco');
const inputDesc = document.getElementById('input-desc-valor');
const grid = document.getElementById('lista-produtos');
const displayTotal = document.getElementById('total-operacao');
const displayItens = document.getElementById('total-itens');
const displaySubtotal = document.getElementById('display-subtotal');
const tituloOperacao = document.getElementById('titulo-operacao');

// --- Elementos do Modal de Pagamento ---
const modalPagamento = document.getElementById('modal-pagamento');
const inputPayDinheiro = document.getElementById('pay-dinheiro');
const inputPayCartao = document.getElementById('pay-cartao');
const inputPayPrazo = document.getElementById('pay-prazo');
const inputDescontoVenda = document.getElementById('desconto');

// =====================================================
// 3. FUNÇÕES AUXILIARES (MOEDA E CÁLCULO)
// =====================================================
function converterParaNumero(valor) {
    if (!valor) return 0;
    let limpo = valor.toString().replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
    return parseFloat(limpo) || 0;
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// =====================================================
// 4. LÓGICA DO CAIXA (TÍTULO E LANÇAMENTO)
// =====================================================
function atualizarTitulo() {
    const produtosAtivos = Object.keys(controleProdutos).filter(nome => controleProdutos[nome] > 0);

    if (produtosAtivos.length === 0) {
        tituloOperacao.innerText = "CAIXA LIVRE";
        return;
    }

    if (produtosAtivos.length === 1) {
        const nome = produtosAtivos[0];
        const quantidadeTotal = controleProdutos[nome];
        tituloOperacao.innerText = `${quantidadeTotal}X ${nome.toUpperCase()}`;
    } else {
        tituloOperacao.innerText = "CAIXA EM OPERAÇÃO!";
    }
}

function calcularSubtotal() {
    const q = parseFloat(inputQtd.value.replace(',', '.')) || 1;
    const p = parseFloat(inputPreco.value.replace(',', '.')) || 0;
    const d = parseFloat(inputDesc.value.replace(',', '.')) || 0;
    const subtotal = (p * q) - d;
    displaySubtotal.innerText = formatarMoeda(subtotal);
}

function lancar() {
    if (!produtoAtual) return;

    const q = parseFloat(inputQtd.value.replace(',', '.')) || 1;
    const p = parseFloat(inputPreco.value.replace(',', '.')) || 0;
    const d = parseFloat(inputDesc.value.replace(',', '.')) || 0;
    const totalItem = (p * q) - d;

    const sequencia = itensCount + 1;

    const linha = document.createElement('div');
    linha.className = 'grid-row';
    linha.innerHTML = `
        <span class="seq">${sequencia}</span>
        <span>${inputProd.value}</span>
        <span class="nome-prod">${produtoAtual.nome}</span>
        <span>UN</span><span>-</span><span>-</span>
        <span>${p.toFixed(2)}</span>
        <span class="qtd-prod">${q.toFixed(2)}</span>
        <span>${d.toFixed(2)}</span>
        <span class="total-item">${totalItem.toFixed(2)}</span>
    `;

    grid.appendChild(linha);
    grid.scrollTop = grid.scrollHeight;

    if (!controleProdutos[produtoAtual.nome]) controleProdutos[produtoAtual.nome] = 0;
    controleProdutos[produtoAtual.nome] += q;

    totalGeral += totalItem;
    itensCount++;

    atualizarTitulo();
    displayItens.innerText = itensCount;
    displayTotal.innerText = formatarMoeda(totalGeral);

    // Reset campos
    inputProd.value = '';
    inputQtd.value = '1,00';
    inputPreco.value = '0,00';
    inputDesc.value = '';
    displaySubtotal.innerText = 'R$ 0,00';
    inputProd.focus();
    produtoAtual = null;
}

// =====================================================
// 5. MODAL DE PAGAMENTO (F10) - LÓGICA COMPLETA
// =====================================================
function abrirPagamento() {
    if (totalGeral <= 0) {
        alert("Lance produtos primeiro!");
        return;
    }

    // Puxa valores para o modal
    document.getElementById('sub-total').value = formatarMoeda(totalGeral);
    document.getElementById('modal-total-pagar').value = formatarMoeda(totalGeral);
    
    // Limpa campos de pagamento
    inputPayDinheiro.value = '';
    inputPayCartao.value = '';
    inputPayPrazo.value = '';
    inputDescontoVenda.value = '0';
    document.getElementById('modal-troco').innerText = "R$ 0,00";
    document.getElementById('soma-pagamentos').innerText = "R$ 0,00";

    modalPagamento.style.display = 'flex';
    setTimeout(() => inputPayDinheiro.focus(), 100);
}

function calcularTotaisPagamento() {
    const subTotal = totalGeral;
    const descPorcentagem = parseFloat(inputDescontoVenda.value) || 0;
    
    const valorDesconto = subTotal * (descPorcentagem / 100);
    const valorTotalFinal = subTotal - valorDesconto;
    
    document.getElementById('modal-total-pagar').value = formatarMoeda(valorTotalFinal);

    const vDinheiro = converterParaNumero(inputPayDinheiro.value);
    const vCartao = converterParaNumero(inputPayCartao.value);
    const vPrazo = converterParaNumero(inputPayPrazo.value);
    
    const somaPaga = vDinheiro + vCartao + vPrazo;
    
    document.getElementById('soma-pagamentos').innerText = formatarMoeda(somaPaga);
    document.getElementById('resumo-dinheiro').innerText = formatarMoeda(vDinheiro);
    document.getElementById('resumo-cartao').innerText = formatarMoeda(vCartao);
    document.getElementById('resumo-prazo').innerText = formatarMoeda(vPrazo);

    const troco = somaPaga - valorTotalFinal;
    const displayTroco = document.getElementById('modal-troco');
    
    if (troco > 0.01) {
        displayTroco.innerText = formatarMoeda(troco);
        displayTroco.style.color = "#2ecc71";
    } else {
        displayTroco.innerText = "R$ 0,00";
        displayTroco.style.color = "#ff4444";
    }
}

function confirmarVenda() {
    const totalAPagar = converterParaNumero(document.getElementById('modal-total-pagar').value);
    const somaPaga = converterParaNumero(document.getElementById('soma-pagamentos').innerText);

    if (somaPaga < (totalAPagar - 0.01)) {
        alert("Valor insuficiente!");
        return;
    }

    alert("✅ VENDA FINALIZADA COM SUCESSO!");

    // Reset Total do Sistema
    totalGeral = 0;
    itensCount = 0;
    controleProdutos = {};
    grid.innerHTML = '';
    displayItens.innerText = '0';
    displayTotal.innerText = 'R$ 0,00';
    displaySubtotal.innerText = 'R$ 0,00';
    tituloOperacao.innerText = "CAIXA LIVRE";

    fecharModal();
}

function fecharModal() {
    modalPagamento.style.display = 'none';
    inputProd.focus();
}

// =====================================================
// 6. REMOVER ITEM (F2)
// =====================================================
function removerItemSequencia() {
    const modalRemover = document.getElementById('modal-remover');
    if (modalRemover) {
        modalRemover.style.display = 'flex';
        const inputRemover = document.getElementById('input-remover-seq');
        inputRemover.value = '';
        setTimeout(() => inputRemover.focus(), 50);
    }
}

function fecharModalRemover() {
    document.getElementById('modal-remover').style.display = 'none';
    inputProd.focus();
}

function confirmarRemocao() {
    const numSeq = document.getElementById('input-remover-seq').value;
    const linhas = document.querySelectorAll('.grid-row');
    let achou = false;

    linhas.forEach(linha => {
        const colSeq = linha.querySelector('.seq');
        if (colSeq && colSeq.innerText === numSeq) {
            const colTotal = linha.querySelector('.total-item');
            const valorItem = parseFloat(colTotal.innerText);
            
            // Ajuste do controle de produtos para o título
            const nomeProd = linha.querySelector('.nome-prod').innerText;
            const qtdProd = parseFloat(linha.querySelector('.qtd-prod').innerText);
            controleProdutos[nomeProd] -= qtdProd;

            totalGeral -= valorItem;
            itensCount--;
            linha.remove();
            achou = true;
        }
    });

    if (achou) {
        document.querySelectorAll('.grid-row').forEach((l, i) => l.querySelector('.seq').innerText = i + 1);
        displayItens.innerText = itensCount;
        displayTotal.innerText = formatarMoeda(totalGeral);
        atualizarTitulo();
        fecharModalRemover();
    } else {
        alert("Item não encontrado!");
    }
}

// =====================================================
// 7. EVENTOS E ATALHOS
// =====================================================

// Listeners de Input para Cálculo em Tempo Real no Modal
[inputPayDinheiro, inputPayCartao, inputPayPrazo, inputDescontoVenda].forEach(el => {
    el.addEventListener('input', calcularTotaisPagamento);
});

// Fluxo de Enter no Lançamento
// Fluxo de Enter no Lançamento (COM BLOQUEIO REAL)
inputProd.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;

    const valorDigitado = inputProd.value.trim();
    if (!valorDigitado) return;

    // aceita "789" ou "789 - COCA COLA"
    const codigo = valorDigitado.split(' ')[0];

    // 🚫 PRODUTO NÃO EXISTE
    if (!produtosDB[codigo]) {
        abrirModalErro();   // teu popup
        inputProd.value = '';
        return;             // TRAVA AQUI
    }

    // ✅ PRODUTO EXISTE
    produtoAtual = produtosDB[codigo];

    inputPreco.value = produtoAtual.preco
        .toFixed(2)
        .replace('.', ',');

    inputQtd.focus();
    inputQtd.select();
    calcularSubtotal();
});

inputQtd.addEventListener('keydown', e => { if (e.key === 'Enter') inputPreco.focus(); });
inputPreco.addEventListener('keydown', e => { if (e.key === 'Enter') inputDesc.focus(); });
inputDesc.addEventListener('keydown', e => { if (e.key === 'Enter') lancar(); });

// Atalhos Globais
window.addEventListener('keydown', e => {
    if (e.key === 'F10') { e.preventDefault(); abrirPagamento(); }
    if (e.key === 'F2') { e.preventDefault(); removerItemSequencia(); }
    
    if (e.key === 'Escape') {
        if (modalPagamento.style.display === 'flex') fecharModal();
        else if (document.getElementById('modal-remover').style.display === 'flex') fecharModalRemover();
    }

    if (e.key === 'F11' && modalPagamento.style.display === 'flex') {
        e.preventDefault();
        confirmarVenda();
    }
});

// Relógio
setInterval(() => {
    const agora = new Date();
    document.getElementById('relogio').innerText = agora.toLocaleString('pt-BR');
}, 1000);

// =====================================================
// 8. MODAL DE PAGAMENTO (LÓGICA REFINADA & INTELIGENTE)
// =====================================================

function abrirPagamento() {
    if (totalGeral <= 0) {
        alert("Lance produtos primeiro!");
        return;
    }

    modalPagamento.style.display = 'flex';
    
    // Reset de campos
    document.getElementById('sub-total').value = formatarMoeda(totalGeral);
    inputDescontoVenda.value = '0';
    inputPayDinheiro.value = '';
    inputPayCartao.value = '';
    inputPayPrazo.value = '';
    
    // Calcula o total inicial (sem desconto)
    calcularTotaisPagamento();

    // Começa o foco pelo campo de DESCONTO
    setTimeout(() => {
        inputDescontoVenda.focus();
        inputDescontoVenda.select();
    }, 100);
}

// Função para sugerir o saldo restante ao focar nos campos de pagamento
function sugerirSaldoRestante(e) {
    const totalAPagar = converterParaNumero(document.getElementById('modal-total-pagar').value);
    
    const vDinheiro = converterParaNumero(inputPayDinheiro.value);
    const vCartao = converterParaNumero(inputPayCartao.value);
    const vPrazo = converterParaNumero(inputPayPrazo.value);
    
    // Se o campo atual estiver vazio, calcula quanto ainda falta pagar
    if (e.target.value === '' || e.target.value === '0,00') {
        const somaOutros = (e.target === inputPayDinheiro ? 0 : vDinheiro) +
                           (e.target === inputPayCartao ? 0 : vCartao) +
                           (e.target === inputPayPrazo ? 0 : vPrazo);
        
        const saldo = totalAPagar - somaOutros;
        if (saldo > 0) {
            e.target.value = saldo.toFixed(2).replace('.', ',');
            calcularTotaisPagamento();
        }
    }
}

function calcularTotaisPagamento() {
    const subTotal = totalGeral;
    const descPorcentagem = parseFloat(inputDescontoVenda.value) || 0;
    
    // Calcula o valor total já subtraindo o desconto
    const valorTotalFinal = subTotal - (subTotal * (descPorcentagem / 100));
    document.getElementById('modal-total-pagar').value = formatarMoeda(valorTotalFinal);

    const vDinheiro = converterParaNumero(inputPayDinheiro.value);
    const vCartao = converterParaNumero(inputPayCartao.value);
    const vPrazo = converterParaNumero(inputPayPrazo.value);
    
    const somaPaga = vDinheiro + vCartao + vPrazo;
    
    // Atualiza Painéis de Resumo lateral e Soma
    document.getElementById('soma-pagamentos').innerText = formatarMoeda(somaPaga);
    document.getElementById('resumo-dinheiro').innerText = formatarMoeda(vDinheiro);
    document.getElementById('resumo-cartao').innerText = formatarMoeda(vCartao);
    document.getElementById('resumo-prazo').innerText = formatarMoeda(vPrazo);

    // LÓGICA DE TROCO: Só calcula se houver valor em Dinheiro e a soma superar o total
    const displayTroco = document.getElementById('modal-troco');
    if (vDinheiro > 0 && somaPaga > (valorTotalFinal + 0.01)) {
        const troco = somaPaga - valorTotalFinal;
        displayTroco.innerText = formatarMoeda(troco);
        displayTroco.style.color = "#2ecc71"; // Verde para troco positivo
    } else {
        displayTroco.innerText = "R$ 0,00";
        displayTroco.style.color = "#333";
    }
}

// --- EVENTOS ---

// Evento de ENTER no campo de Desconto
document.getElementById('desconto').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        
        // 1. Atualiza o cálculo do modal com o novo desconto
        calcularTotaisPagamento();
        
        // 2. Pega o novo valor líquido (já com desconto aplicado)
        const novoTotalComDesconto = converterParaNumero(document.getElementById('modal-total-pagar').value);
        
        // 3. Alimenta o campo de Dinheiro com esse valor novo
        inputPayDinheiro.value = novoTotalComDesconto.toFixed(2).replace('.', ',');
        
        // 4. Pula para o campo de Dinheiro e seleciona o texto
        inputPayDinheiro.focus();
        inputPayDinheiro.select();
        
        // 5. Recalcula para atualizar a soma e o resumo imediatamente
        calcularTotaisPagamento();
    }
});

// Eventos de Foco, Input e Navegação nos campos de pagamento
[inputPayDinheiro, inputPayCartao, inputPayPrazo].forEach(input => {
    input.addEventListener('focus', sugerirSaldoRestante);
    input.addEventListener('input', calcularTotaisPagamento);
    
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.target === inputPayDinheiro) {
                inputPayCartao.focus();
                inputPayCartao.select();
            }
            else if (e.target === inputPayCartao) {
                inputPayPrazo.focus();
                inputPayPrazo.select();
            }
            else {
                confirmarVenda();
            }
        }
    });
});

// Atualiza cálculos ao digitar no desconto
inputDescontoVenda.addEventListener('input', calcularTotaisPagamento);




// =========================================================
// =========================================================
// OBS: PARTE DE NUMERO 9 NO OUTRO AQUIVO JS, PARTE-DO-F4.JS    
// =========================================================

// =========================================================
// 10. PARTE DO MODAL PRODUTO QUE TEM UM ICONE NO INPUT    
// =========================================================

const btn = document.getElementById('btn-consulta');
const modal = document.getElementById('pdv-modal');
const fechar = document.getElementById('pdv-fechar');
const inputProduto = document.getElementById('input-produto');

const linhas = Array.from(document.querySelectorAll('.pdv-tabela tbody tr'));
let indexSelecionado = 0;

// abrir modal
btn.addEventListener('click', () => {
    modal.style.display = 'flex';
    selecionarLinha(0);
});

// fechar modal
fechar.addEventListener('click', () => {
    modal.style.display = 'none';
});

// clicar fora fecha
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// função de seleção
function selecionarLinha(index) {
    linhas.forEach(l => l.classList.remove('selecionado'));

    if (linhas[index]) {
        linhas[index].classList.add('selecionado');
        linhas[index].scrollIntoView({ block: 'nearest' });
        indexSelecionado = index;
    }
}

// clique simples
linhas.forEach((linha, index) => {
    linha.addEventListener('click', () => {
        selecionarLinha(index);
    });

    // duplo clique
    linha.addEventListener('dblclick', () => {
        escolherProduto(linha);
    });
});

// teclado (↑ ↓ Enter)
document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (indexSelecionado < linhas.length - 1) {
            selecionarLinha(indexSelecionado + 1);
        }
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (indexSelecionado > 0) {
            selecionarLinha(indexSelecionado - 1);
        }
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        escolherProduto(linhas[indexSelecionado]);
    }
});

// joga produto no input
function escolherProduto(linha) {
    const codigo = linha.children[0].innerText;
    const descricao = linha.children[1].innerText;

    inputProduto.value = `${codigo} - ${descricao}`;
    modal.style.display = 'none';
    inputProduto.focus();
}




