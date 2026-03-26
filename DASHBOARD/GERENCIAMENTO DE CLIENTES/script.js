/* ─── DADOS SIMULADOS ─── */
  const clientes = {
    "353": {
      nome: "MARIA APARECIDA DE PAULA SANTOS",
      titulos: [
        { doc:"20823", cupom:"20823", par:"1/3", esp:"CR", ser:"1", emissao:"16/01/2026", valor:133.00, venc:"16/02/2026", dias:5, juros:1.11, pago:0.00, pagamento:"", emAberto:134.11 },
        { doc:"19604", cupom:"19604", par:"4/4", esp:"CR", ser:"1", emissao:"30/10/2025", valor:331.20, venc:"02/03/2026", dias:0, juros:0.00, pago:0.00, pagamento:"", emAberto:331.20 },
        { doc:"20648", cupom:"20648", par:"2/3", esp:"CR", ser:"1", emissao:"30/12/2025", valor:100.00, venc:"02/03/2026", dias:0, juros:0.00, pago:0.00, pagamento:"", emAberto:100.00 },
        { doc:"19649", cupom:"19649", par:"4/4", esp:"CR", ser:"1", emissao:"04/11/2025", valor:86.90,  venc:"06/03/2026", dias:0, juros:0.00, pago:0.00, pagamento:"", emAberto:86.90 },
        { doc:"20823", cupom:"20823", par:"2/3", esp:"CR", ser:"1", emissao:"16/01/2026", valor:133.00, venc:"18/03/2026", dias:0, juros:0.00, pago:0.00, pagamento:"", emAberto:133.00 },
        { doc:"20648", cupom:"20648", par:"3/3", esp:"CR", ser:"1", emissao:"30/12/2025", valor:98.90,  venc:"01/04/2026", dias:0, juros:0.00, pago:0.00, pagamento:"", emAberto:98.90 },
        { doc:"20823", cupom:"20823", par:"3/3", esp:"CR", ser:"1", emissao:"16/01/2026", valor:132.80, venc:"17/04/2026", dias:0, juros:0.00, pago:0.00, pagamento:"", emAberto:132.80 },
      ]
    },
    "100": {
      nome: "JOÃO CARLOS DA SILVA",
      titulos: [
        { doc:"18001", cupom:"18001", par:"1/2", esp:"CR", ser:"1", emissao:"10/11/2025", valor:450.00, venc:"10/01/2026", dias:42, juros:12.50, pago:0.00, pagamento:"", emAberto:462.50 },
        { doc:"18001", cupom:"18001", par:"2/2", esp:"CR", ser:"1", emissao:"10/11/2025", valor:450.00, venc:"10/02/2026", dias:11, juros:3.10, pago:0.00, pagamento:"", emAberto:453.10 },
      ]
    }
  };

  let clienteAtual = null;
  let tituloSelecionado = null;

  /* ─── FORMATO ─── */
  const fmt = v => v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  /* ─── BUSCAR CLIENTE ─── */
  function buscarCliente() {
    const q = document.getElementById('inputCliente').value.trim();
    if (!q) { alert("Informe o código ou nome do cliente."); return; }

    const found = Object.entries(clientes).find(([code, c]) =>
      code === q || c.nome.toLowerCase().includes(q.toLowerCase())
    );

    if (!found) {
      alert("Cliente não encontrado. Tente: 353 ou 100");
      return;
    }

    const [code, cliente] = found;
    clienteAtual = { code, ...cliente };

    document.getElementById('clienteCode').textContent = code;
    document.getElementById('clienteNome').textContent = cliente.nome;
    document.getElementById('clienteBadge').classList.add('visible');
    document.getElementById('actionBar').style.display = 'flex';
    document.getElementById('totalsBar').style.display = 'grid';
    document.getElementById('emptyState').style.display = 'none';

    renderTable(cliente.titulos, code);
    renderTotals(cliente.titulos);
  }

  /* ─── RENDER TABLE ─── */
  function renderTable(titulos, code) {
    const tbody = document.getElementById('tbodyContas');
    tbody.innerHTML = '';

    titulos.forEach((t, i) => {
      const overdue = t.dias > 0;
      const tr = document.createElement('tr');
      if (overdue) tr.classList.add('overdue');

      tr.innerHTML = `
        <td class="cb-col"><input type="checkbox" class="row-cb" /></td>
        <td class="mono">${t.doc}</td>
        <td class="mono">${t.cupom}</td>
        <td class="center">${t.par}</td>
        <td class="center">${t.esp}</td>
        <td class="center">${t.ser}</td>
        <td>${code}</td>
        <td class="mono">${t.emissao}</td>
        <td class="mono right">R$ ${fmt(t.valor)}</td>
        <td class="mono">${overdue ? `<span style="color:var(--red)">${t.venc}</span>` : t.venc}</td>
        <td class="mono center">—</td>
        <td class="center">${overdue ? `<span class="badge badge-red">${t.dias}</span>` : '<span class="badge badge-green">0</span>'}</td>
        <td class="mono right">${overdue ? `<span style="color:var(--red)">${fmt(t.juros)}</span>` : '0,00'}</td>
        <td class="mono right">${fmt(t.pago)}</td>
        <td class="mono">${t.pagamento || '—'}</td>
        <td class="mono right"><strong>${fmt(t.emAberto)}</strong></td>
        <td class="center">
          <button class="row-baixar ${overdue ? 'overdue-btn' : ''}" onclick="abrirModal(${i})">⬇ Baixar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('qtdDocs').textContent = titulos.length;
    document.getElementById('mediaAtraso').textContent =
      titulos.filter(t => t.dias > 0).length > 0
        ? Math.round(titulos.filter(t=>t.dias>0).reduce((a,t)=>a+t.dias,0) / titulos.filter(t=>t.dias>0).length)
        : 0;
  }

  /* ─── RENDER TOTALS ─── */
  function renderTotals(titulos) {
    const semJuros = titulos.reduce((a,t)=>a+t.valor,0);
    const comJuros = titulos.reduce((a,t)=>a+t.emAberto,0);
    const vencido  = titulos.filter(t=>t.dias>0).reduce((a,t)=>a+t.emAberto,0);
    const vencer   = titulos.filter(t=>t.dias===0).reduce((a,t)=>a+t.emAberto,0);

    document.getElementById('totSemJuros').textContent = fmt(semJuros);
    document.getElementById('totComJuros').textContent = fmt(comJuros);
    document.getElementById('totVencido').textContent  = fmt(vencido);
    document.getElementById('totVencer').textContent   = fmt(vencer);
    document.getElementById('totPago').textContent     = '0,00';
    document.getElementById('totJurosPago').textContent= '0,00';
    document.getElementById('totCredito').textContent  = '0,00';
  }

  /* ─── LIMPAR FILTROS ─── */
  function limparFiltros() {
    document.getElementById('inputCliente').value = '';
    document.getElementById('periodoDe').value = '';
    document.getElementById('periodoAte').value = '';
    document.getElementById('clienteBadge').classList.remove('visible');
    document.getElementById('actionBar').style.display = 'none';
    document.getElementById('totalsBar').style.display = 'none';
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('tbodyContas').innerHTML = '';
    document.getElementById('qtdDocs').textContent = '0';
    document.getElementById('mediaAtraso').textContent = '0';
    clienteAtual = null;
    ['totSemJuros','totComJuros','totVencido','totVencer','totPago','totJurosPago','totCredito']
      .forEach(id => document.getElementById(id).textContent = '0,00');
  }

  /* ─── TOGGLE ALL ─── */
  function toggleAll(cb) {
    document.querySelectorAll('.row-cb').forEach(c => c.checked = cb.checked);
  }

  /* ─── ABRIR MODAL ─── */
  function abrirModal(idx) {
    if (!clienteAtual) return;
    tituloSelecionado = { idx, titulo: clienteAtual.titulos[idx] };
    const t = tituloSelecionado.titulo;

    // preenche modal
    document.getElementById('mCliente').textContent    = clienteAtual.nome;
    document.getElementById('mDocumento').textContent  = `${t.doc} — Parcela ${t.par}`;
    document.getElementById('mEmissao').textContent    = t.emissao;
    document.getElementById('mVencimento').textContent = t.venc;
    document.getElementById('mDias').textContent       = t.dias > 0 ? `${t.dias} dia(s)` : 'Em dia ✓';
    document.getElementById('mDias').className         = t.dias > 0 ? 'red' : '';
    document.getElementById('mValor').textContent      = `R$ ${fmt(t.valor)}`;
    document.getElementById('mJuros').textContent      = `R$ ${fmt(t.juros)}`;
    document.getElementById('mTotal').textContent      = `R$ ${fmt(t.emAberto)}`;
    document.getElementById('mValorRec').value         = fmt(t.emAberto);
    document.getElementById('mDesconto').value         = '0,00';
    document.getElementById('mObs').value              = '';
    document.getElementById('jurosAlert').style.display= t.dias > 0 ? 'flex' : 'none';

    // data de hoje
    const hoje = new Date();
    document.getElementById('mDataPag').value = hoje.toISOString().split('T')[0];

    // reset success
    document.getElementById('successOverlay').classList.remove('visible');
    document.getElementById('modalBodyNormal').style.display = 'flex';
    document.getElementById('modalFooter').style.display = 'flex';

    document.getElementById('modalBaixa').classList.add('open');
  }

  /* ─── FECHAR MODAL ─── */
  function fecharModal() {
    document.getElementById('modalBaixa').classList.remove('open');
  }

  /* ─── CONFIRMAR BAIXA ─── */
  function confirmarBaixa() {
    const valorRec = parseFloat(
      document.getElementById('mValorRec').value.replace('.','').replace(',','.')
    ) || 0;
    const forma = document.getElementById('mFormaPag').value;
    const data  = document.getElementById('mDataPag').value;

    if (!data)   { alert("Informe a data de pagamento."); return; }
    if (valorRec <= 0) { alert("Informe o valor recebido."); return; }

    // Atualiza dados simulados
    if (tituloSelecionado && clienteAtual) {
      const t = clienteAtual.titulos[tituloSelecionado.idx];
      t.pago      = t.emAberto;
      t.emAberto  = 0;
      t.pagamento = data.split('-').reverse().join('/');
      t.dias      = 0;
      t.juros     = 0;
    }

    // Mostra success
    document.getElementById('modalBodyNormal').style.display = 'none';
    document.getElementById('successOverlay').classList.add('visible');
    document.getElementById('successMsg').textContent =
      `Baixa de R$ ${fmt(valorRec)} registrada via ${document.getElementById('mFormaPag').options[document.getElementById('mFormaPag').selectedIndex].text}.`;
    document.getElementById('modalFooter').innerHTML =
      `<button class="btn btn-primary" onclick="fecharEAtualizar()">✓ Concluir</button>`;
  }

  function fecharEAtualizar() {
    fecharModal();
    if (clienteAtual) {
      renderTable(clienteAtual.titulos, clienteAtual.code);
      renderTotals(clienteAtual.titulos);
    }
    // restaura footer
    document.getElementById('modalFooter').innerHTML = `
      <button class="btn btn-default" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarBaixa()">✔ Confirmar Baixa</button>
    `;
  }

  /* ─── ENTER no input ─── */
  document.getElementById('inputCliente').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarCliente();
  });

  /* ─── Fecha modal clicando fora ─── */
  document.getElementById('modalBaixa').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
  });

  /* ─── Inicializa empty state ─── */
  document.getElementById('emptyState').style.display = 'flex';
  document.getElementById('totalsBar').style.display = 'none';


const btnFicha = document.querySelector('.btn-ficha');
const modal = document.getElementById('fichaOverlay');
const closeBtn = document.querySelector('.ficha-close');
const lista = document.getElementById('listaAtrasados');

btnFicha.addEventListener('click', () => {
  modal.style.display = 'flex';
  gerarListaAtrasados();
});

closeBtn.onclick = () => modal.style.display = 'none';

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

function gerarListaAtrasados() {
  lista.innerHTML = '';

  const clientesComAtraso = [];

  Object.entries(clientes).forEach(([code, c]) => {
    const temAtraso = c.titulos.some(t => t.dias > 0);

    if (temAtraso) {
      clientesComAtraso.push({
        code,
        nome: c.nome
      });
    }
  });

  clientesComAtraso.forEach(c => {
    const input = document.createElement('input');
    input.className = 'input-cliente';
    input.value = `${c.code} - ${c.nome}`;
    input.readOnly = true;

    input.addEventListener('click', () => {
      abrirFichaCliente(c.code);
      modal.style.display = 'none';
    });

    lista.appendChild(input);
  });

  if (clientesComAtraso.length === 0) {
    lista.innerHTML = '<p style="color:#9ca3af">Nenhum cliente em atraso</p>';
  }
}

// 🔥 mantém teu fluxo original
function abrirFichaCliente(idCliente) {
  document.getElementById('inputCliente').value = idCliente;
  buscarCliente();
}   
