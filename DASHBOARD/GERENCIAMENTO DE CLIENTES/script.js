// ==================================================================
// REFRICONTROL — clientes.js
// Cole o conteúdo deste arquivo no FINAL do seu script.js
// (ainda dentro do DOMContentLoaded, antes do último })
//
// Ou inclua como arquivo separado no HTML:
// <script src="clientes.js"></script>  (após o script.js)
// ==================================================================


// ------------------------------------------------------------------
// BANCO DE DADOS DE CLIENTES (localStorage)
// ------------------------------------------------------------------

// Carrega clientes salvos ou inicia com exemplos
function carregarClientes() {
    const salvo = localStorage.getItem('refricontrol_clientes');
    if (salvo) return JSON.parse(salvo);

    // Dados iniciais de exemplo
    return [
        {
            cod: 'CLI-001',
            nome: 'Marcos Pereira',
            cpf: '123.456.789-00',
            tel: '(27) 99812-3456',
            end: 'Rua das Flores, 142 - Vila Velha',
            status: 'Ativo',
            limite: 800,
            compras: [
                { desc: 'Recarga gás R134a', valor: 280, data: '2025-12-10', pagamento: 'Pix', vencimento: null, pago: true },
                { desc: 'Troca compressor', valor: 560, data: '2026-01-15', pagamento: 'Prazo', vencimento: '2026-02-15', pago: false },
            ]
        },
        {
            cod: 'CLI-002',
            nome: 'Ana Lima',
            cpf: '987.654.321-00',
            tel: '(27) 99734-5678',
            end: 'Av. Carlos Lindenberg, 890 - Vitória',
            status: 'Ativo',
            limite: 500,
            compras: [
                { desc: 'Manutenção split', valor: 180, data: '2026-02-20', pagamento: 'Dinheiro', vencimento: null, pago: true },
            ]
        },
        {
            cod: 'CLI-003',
            nome: 'Roberto Santos',
            cpf: '456.789.123-00',
            tel: '(27) 99621-9900',
            end: 'Rua Sete, 55 - Serra',
            status: 'Inativo',
            limite: 300,
            compras: []
        }
    ];
}

function salvarClientes() {
    localStorage.setItem('refricontrol_clientes', JSON.stringify(clientes));
}

// Array global de clientes
let clientes = carregarClientes();

// Índice do cliente atualmente exibido no perfil
let cliIndiceAtual = null;


// ------------------------------------------------------------------
// BUSCA E AUTOCOMPLETE
// ------------------------------------------------------------------
const cliBusca     = document.getElementById('cliBusca');
const cliSugestoes = document.getElementById('cliSugestoes');

if (cliBusca) {
    cliBusca.addEventListener('input', () => {
        const termo = cliBusca.value.toLowerCase().trim();

        // Esconde sugestões se o campo estiver vazio
        if (!termo) {
            cliSugestoes.style.display = 'none';
            return;
        }

        // Filtra clientes que batem com nome, CPF ou código
        const encontrados = clientes.filter(c =>
            c.nome.toLowerCase().includes(termo) ||
            c.cpf.includes(termo) ||
            c.cod.toLowerCase().includes(termo)
        );

        if (encontrados.length === 0) {
            cliSugestoes.style.display = 'none';
            return;
        }

        // Monta as sugestões no dropdown
        cliSugestoes.innerHTML = encontrados.map((c, i) => {
            const indiceReal = clientes.indexOf(c);
            const iniciais = c.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
            return `
                <div class="cli-sugestao-item" onclick="cliCarregarPerfil(${indiceReal})">
                    <div class="cli-sugestao-avatar">${iniciais}</div>
                    <div>
                        <div class="cli-sugestao-nome">${c.nome}</div>
                        <div class="cli-sugestao-meta">Cód: ${c.cod} · CPF: ${c.cpf} · ${c.status}</div>
                    </div>
                </div>
            `;
        }).join('');

        cliSugestoes.style.display = 'block';
    });

    // Fecha o dropdown ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!cliBusca.contains(e.target) && !cliSugestoes.contains(e.target)) {
            cliSugestoes.style.display = 'none';
        }
    });
}


// ------------------------------------------------------------------
// CARREGAR PERFIL DO CLIENTE
// Preenche todos os campos do painel com os dados do cliente selecionado
// ------------------------------------------------------------------
function cliCarregarPerfil(indice) {
    cliIndiceAtual = indice;
    const c = clientes[indice];

    // Esconde o estado inicial e mostra o perfil
    document.getElementById('cliEstadoInicial').style.display = 'none';
    document.getElementById('cliPerfil').style.display = 'flex';

    // Iniciais para o avatar
    const iniciais = c.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('cliAvatar').textContent = iniciais;

    // Dados básicos
    document.getElementById('cliNomeExibido').textContent = c.nome;
    document.getElementById('cliTelExibido').textContent  = c.tel;
    document.getElementById('cliEndExibido').textContent  = c.end;
    document.getElementById('cliCodExibido').textContent  = c.cod;
    document.getElementById('cliCpfExibido').textContent  = c.cpf;

    // Badge de status
    const badge = document.getElementById('cliStatusBadge');
    badge.textContent = c.status;
    badge.className = `cli-badge ${c.status === 'Ativo' ? 'cli-badge-ativo' : 'cli-badge-inativo'}`;

    // Fecha o dropdown e limpa a busca
    cliSugestoes.style.display = 'none';
    cliBusca.value = c.nome;

    // Atualiza os cards de resumo e as tabelas
    cliAtualizarResumo();
    cliRenderizarCompras('todos');
    cliAtualizarPendencias();

    // Volta para a aba de compras ao trocar de cliente
    document.querySelectorAll('.cli-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.cli-tab-btn')[0].classList.add('active');
    cliMostrarAba(null, 'compras');
}


// ------------------------------------------------------------------
// CARDS DE RESUMO FINANCEIRO
// ------------------------------------------------------------------
function cliAtualizarResumo() {
    const c = clientes[cliIndiceAtual];
    if (!c) return;

    // Soma total gasto (todas as compras pagas)
    const totalGasto = c.compras
        .filter(cp => cp.pago)
        .reduce((acc, cp) => acc + cp.valor, 0);

    // Soma total em aberto (compras não pagas)
    const totalAberto = c.compras
        .filter(cp => !cp.pago)
        .reduce((acc, cp) => acc + cp.valor, 0);

    // Quantidade de compras no prazo
    const qtdPrazo = c.compras.filter(cp => cp.pagamento === 'Prazo').length;

    // Última compra (ordenada por data)
    const datas = c.compras.map(cp => cp.data).sort().reverse();
    const ultima = datas[0]
        ? new Date(datas[0] + 'T12:00:00').toLocaleDateString('pt-BR')
        : '—';

    document.getElementById('cliTotalGasto').textContent =
        totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('cliTotalAberto').textContent =
        totalAberto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('cliQtdPrazo').textContent  = qtdPrazo;
    document.getElementById('cliUltimaCompra').textContent = ultima;
}


// ------------------------------------------------------------------
// RENDERIZAR TABELA DE COMPRAS
// filtro: 'todos' | 'Dinheiro' | 'Pix' | 'Cartão' | 'Prazo'
// ------------------------------------------------------------------
function cliRenderizarCompras(filtro = 'todos') {
    const c = clientes[cliIndiceAtual];
    const tbody = document.getElementById('cliListaCompras');
    const vazio = document.getElementById('cliComprasVazio');
    if (!c || !tbody) return;

    // Filtra por forma de pagamento se necessário
    const lista = filtro === 'todos'
        ? c.compras
        : c.compras.filter(cp => cp.pagamento === filtro);

    tbody.innerHTML = '';

    if (lista.length === 0) {
        vazio.style.display = 'block';
        return;
    }

    vazio.style.display = 'none';

    lista.forEach((cp, i) => {
        const indiceReal = c.compras.indexOf(cp);
        const dataFmt = new Date(cp.data + 'T12:00:00').toLocaleDateString('pt-BR');
        const vencFmt = cp.vencimento
            ? new Date(cp.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')
            : '—';

        // Define badge de status da compra
        let statusHtml;
        if (cp.pago) {
            statusHtml = '<span class="status in-stock">Pago</span>';
        } else if (cp.pagamento === 'Prazo') {
            statusHtml = '<span class="status low-stock">Pendente</span>';
        } else {
            statusHtml = '<span class="status out-of-stock">—</span>';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFmt}</td>
            <td>${cp.desc}</td>
            <td>${cp.pagamento}</td>
            <td><strong>${cp.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></td>
            <td>${vencFmt}</td>
            <td>${statusHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}


// ------------------------------------------------------------------
// RENDERIZAR ABA DE PENDÊNCIAS
// Com ou sem juros compostos calculados por dias de atraso
// ------------------------------------------------------------------
function cliAtualizarPendencias() {
    const c = clientes[cliIndiceAtual];
    const tbody  = document.getElementById('cliListaPendencias');
    const vazio  = document.getElementById('cliPendenciasVazio');
    if (!c || !tbody) return;

    // Verifica se o toggle de juros está ativo
    const aplicarJuros = document.getElementById('cliToggleJuros')?.checked || false;
    const taxaMensal   = parseFloat(document.getElementById('cliTaxaJuros')?.value || 2);

    // Filtra apenas compras a prazo não pagas
    const pendentes = c.compras.filter(cp => cp.pagamento === 'Prazo' && !cp.pago);

    tbody.innerHTML = '';

    if (pendentes.length === 0) {
        vazio.style.display = 'block';
        return;
    }

    vazio.style.display = 'none';
    const hoje = new Date();

    pendentes.forEach((cp) => {
        const indiceReal = c.compras.indexOf(cp);
        const venc = cp.vencimento ? new Date(cp.vencimento + 'T12:00:00') : null;

        // Calcula dias em atraso
        let diasAtraso = 0;
        let badgeClass = 'em-dia';
        let badgeTexto = 'Em dia';

        if (venc) {
            const diffMs = hoje - venc;
            diasAtraso = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diasAtraso > 0) {
                badgeClass = 'atrasado';
                badgeTexto = `${diasAtraso} dias`;
            } else if (diasAtraso === 0) {
                badgeClass = 'vence-hoje';
                badgeTexto = 'Vence hoje';
            }
        }

        // Calcula valor com juros compostos diários (baseado na taxa mensal)
        // Fórmula: Valor × (1 + taxa/30)^diasAtraso
        let valorComJuros = cp.valor;
        if (aplicarJuros && diasAtraso > 0) {
            const taxaDiaria = taxaMensal / 100 / 30;
            valorComJuros = cp.valor * Math.pow(1 + taxaDiaria, diasAtraso);
        }

        const vencFmt = venc ? venc.toLocaleDateString('pt-BR') : '—';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cp.desc}</td>
            <td>${cp.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${vencFmt}</td>
            <td><span class="badge-atraso ${badgeClass}">${badgeTexto}</span></td>
            <td>
                <strong style="color:${diasAtraso > 0 ? '#b91c1c' : '#15803d'}">
                    ${valorComJuros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
                ${aplicarJuros && diasAtraso > 0
                    ? `<small style="display:block; color:#6b7280; font-size:0.75rem;">${taxaMensal}% a.m.</small>`
                    : ''}
            </td>
            <td>
                <!-- Botão de dar baixa: marca a compra como paga -->
                <button class="btn-baixa" onclick="cliDarBaixa(${indiceReal})">✅ Dar baixa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


// ------------------------------------------------------------------
// DAR BAIXA EM PENDÊNCIA
// Marca uma compra como paga e atualiza a interface
// ------------------------------------------------------------------
function cliDarBaixa(indiceCompra) {
    const c = clientes[cliIndiceAtual];
    const cp = c.compras[indiceCompra];

    const confirmado = confirm(
        `Confirmar baixa de "${cp.desc}" no valor de R$ ${cp.valor.toFixed(2)}?`
    );
    if (!confirmado) return;

    cp.pago = true; // Marca como paga
    salvarClientes();

    // Atualiza tudo na tela
    cliAtualizarResumo();
    cliRenderizarCompras('todos');
    cliAtualizarPendencias();

    mostrarToast('✅ Baixa realizada com sucesso!', 'sucesso');
}


// ------------------------------------------------------------------
// FILTRO DE FORMA DE PAGAMENTO
// ------------------------------------------------------------------
function cliFiltrarCompras(btn, filtro) {
    // Atualiza botão ativo
    document.querySelectorAll('.cli-filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cliRenderizarCompras(filtro);
}


// ------------------------------------------------------------------
// ALTERNÂNCIA DE ABAS (Compras / Pendências)
// ------------------------------------------------------------------
function cliMostrarAba(btn, aba) {
    // Atualiza botões
    if (btn) {
        document.querySelectorAll('.cli-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // Mostra/esconde painéis
    document.getElementById('cli-aba-compras').style.display    = aba === 'compras'    ? 'block' : 'none';
    document.getElementById('cli-aba-pendencias').style.display = aba === 'pendencias' ? 'block' : 'none';
}


// ------------------------------------------------------------------
// MODAL DE NOVO CLIENTE
// ------------------------------------------------------------------
let cliIndiceEditando = null;

function cliAbrirModal(indice = null) {
    cliIndiceEditando = indice;
    const titulo = document.getElementById('modalClienteTitulo');

    if (indice !== null) {
        // Modo edição: preenche os campos com os dados existentes
        const c = clientes[indice];
        titulo.textContent = 'Editar Cliente';
        document.getElementById('cliNome').value    = c.nome;
        document.getElementById('cliCod').value     = c.cod;
        document.getElementById('cliCpf').value     = c.cpf;
        document.getElementById('cliTel').value     = c.tel;
        document.getElementById('cliEnd').value     = c.end;
        document.getElementById('cliStatus').value  = c.status;
        document.getElementById('cliLimite').value  = c.limite;
    } else {
        // Modo cadastro: limpa campos
        titulo.textContent = 'Cadastrar Cliente';
        ['cliNome','cliCod','cliCpf','cliTel','cliEnd','cliLimite'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('cliStatus').value = 'Ativo';
    }

    document.getElementById('modalCliente').style.display = 'flex';
}

function cliFecharModal() {
    document.getElementById('modalCliente').style.display = 'none';
    cliIndiceEditando = null;
}

function cliSalvarCliente() {
    const nome   = document.getElementById('cliNome').value.trim();
    const cod    = document.getElementById('cliCod').value.trim();
    const cpf    = document.getElementById('cliCpf').value.trim();
    const tel    = document.getElementById('cliTel').value.trim();
    const end    = document.getElementById('cliEnd').value.trim();
    const status = document.getElementById('cliStatus').value;
    const limite = parseFloat(document.getElementById('cliLimite').value) || 0;

    if (!nome || !cod) {
        mostrarToast('⚠️ Nome e código são obrigatórios!', 'aviso');
        return;
    }

    if (cliIndiceEditando !== null) {
        // Atualiza cliente existente (mantém as compras)
        clientes[cliIndiceEditando] = { ...clientes[cliIndiceEditando], nome, cod, cpf, tel, end, status, limite };
        mostrarToast('✅ Cliente atualizado!', 'sucesso');
        // Se estava com o perfil deste cliente aberto, recarrega
        if (cliIndiceAtual === cliIndiceEditando) cliCarregarPerfil(cliIndiceEditando);
    } else {
        // Novo cliente com array de compras vazio
        clientes.push({ nome, cod, cpf, tel, end, status, limite, compras: [] });
        mostrarToast('✅ Cliente cadastrado!', 'sucesso');
    }

    salvarClientes();
    cliFecharModal();
}

// Botão "+ Novo Cliente" no header
const cliBtnNovo = document.getElementById('cliBtnNovo');
if (cliBtnNovo) cliBtnNovo.addEventListener('click', () => cliAbrirModal());


// ------------------------------------------------------------------
// EDITAR CLIENTE A PARTIR DO PERFIL
// ------------------------------------------------------------------
function cliEditarCliente() {
    if (cliIndiceAtual === null) return;
    cliAbrirModal(cliIndiceAtual);
}


// ------------------------------------------------------------------
// MODAL DE NOVA COMPRA
// ------------------------------------------------------------------
function cliAbrirNovaCompra() {
    // Preenche data de hoje por padrão
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('compraData').value = hoje;
    document.getElementById('compraDesc').value  = '';
    document.getElementById('compraValor').value = '';
    document.getElementById('compraPagamento').value = 'Dinheiro';
    document.getElementById('wrapperVencimento').style.display = 'none';

    document.getElementById('modalCompra').style.display = 'flex';
}

function cliFecharModalCompra() {
    document.getElementById('modalCompra').style.display = 'none';
}

// Mostra/esconde campo de vencimento dependendo da forma de pagamento
function cliToggleVencimento() {
    const pag = document.getElementById('compraPagamento').value;
    document.getElementById('wrapperVencimento').style.display =
        pag === 'Prazo' ? 'block' : 'none';
}

function cliSalvarCompra() {
    const desc      = document.getElementById('compraDesc').value.trim();
    const valor     = parseFloat(document.getElementById('compraValor').value);
    const data      = document.getElementById('compraData').value;
    const pagamento = document.getElementById('compraPagamento').value;
    const vencimento = document.getElementById('compraVencimento').value || null;

    if (!desc || isNaN(valor) || !data) {
        mostrarToast('⚠️ Preencha todos os campos!', 'aviso');
        return;
    }

    if (pagamento === 'Prazo' && !vencimento) {
        mostrarToast('⚠️ Informe o vencimento para compras a prazo!', 'aviso');
        return;
    }

    // Compras a prazo ficam pendentes; outros pagamentos já entram como pagos
    const pago = pagamento !== 'Prazo';

    clientes[cliIndiceAtual].compras.push({ desc, valor, data, pagamento, vencimento, pago });
    salvarClientes();

    // Atualiza toda a interface do perfil
    cliAtualizarResumo();
    cliRenderizarCompras('todos');
    cliAtualizarPendencias();
    cliFecharModalCompra();

    mostrarToast('✅ Compra registrada!', 'sucesso');
}


// ------------------------------------------------------------------
// IMPRESSÃO DE RECIBO
// Gera um recibo das compras do cliente e aciona window.print()
// ------------------------------------------------------------------
function cliImprimirRecibo() {
    const c = clientes[cliIndiceAtual];
    if (!c) return;

    const dataHoje = new Date().toLocaleDateString('pt-BR');

    // Monta as linhas da tabela de compras para o recibo
    const linhas = c.compras.map(cp => {
        const dataFmt = new Date(cp.data + 'T12:00:00').toLocaleDateString('pt-BR');
        return `
            <tr>
                <td>${dataFmt}</td>
                <td>${cp.desc}</td>
                <td>${cp.pagamento}</td>
                <td style="text-align:right">${cp.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td style="text-align:center">${cp.pago ? 'Pago' : 'Pendente'}</td>
            </tr>
        `;
    }).join('');

    const totalGeral = c.compras.reduce((acc, cp) => acc + cp.valor, 0);

    // Injeta o HTML do recibo na área de impressão
    document.getElementById('conteudoRecibo').innerHTML = `
        <div class="recibo-print">
            <h2>RefriControl — Recibo</h2>
            <p class="recibo-sub">Emitido em ${dataHoje}</p>

            <table>
                <tr style="background:#eef2f6">
                    <th>Data</th><th>Descrição</th><th>Pagamento</th><th>Valor</th><th>Status</th>
                </tr>
                ${linhas}
            </table>

            <p class="recibo-total">Total: ${totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>

            <hr style="border:none; border-top:1px solid #e5e7eb; margin:12px 0">
            <p><strong>Cliente:</strong> ${c.nome}</p>
            <p><strong>CPF:</strong> ${c.cpf}</p>
            <p><strong>Telefone:</strong> ${c.tel}</p>
            <p><strong>Endereço:</strong> ${c.end}</p>

            <p class="recibo-rodape">Refrigeração Mariano · Documento gerado pelo RefriControl</p>
        </div>
    `;

    window.print(); // Aciona a impressão do navegador
}


// ------------------------------------------------------------------
// FECHA MODAIS DE CLIENTES AO CLICAR NO FUNDO ESCURO
// ------------------------------------------------------------------
document.getElementById('modalCliente')?.addEventListener('click', function(e) {
    if (e.target === this) cliFecharModal();
});

document.getElementById('modalCompra')?.addEventListener('click', function(e) {
    if (e.target === this) cliFecharModalCompra();
});