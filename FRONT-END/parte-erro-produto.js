// ===== POPUP ERRO (APPLE CLEAN – JS PURO) =====
const popupErro = document.createElement('div');
popupErro.id = 'popup-erro-produto';

popupErro.innerHTML = `
  <div class="popup-overlay">
    <div class="popup-box">
      <div class="popup-icon">!</div>
      <h2>Produto não encontrado</h2>
      <p>Verifique o código digitado</p>
      <button id="btn-ok-erro">OK</button>
    </div>
  </div>
`;

document.body.appendChild(popupErro);

// ===== CSS INJETADO PELO JS (ESTILO APPLE) =====
const style = document.createElement('style');
style.innerHTML = `
  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(6px);
  }

  .popup-box {
    background: #fff;
    width: 400px;
    padding: 30px 30px 26px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 30px 60px rgba(0,0,0,.25);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    animation: applePop .18s ease-out;
  }

  .popup-icon {
    width: 46px;
    height: 46px;
    margin: 0 auto 14px;
    border-radius: 50%;
    background: #ff3b30;
    color: #fff;
    font-size: 26px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .popup-box h2 {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 600;
    color: #111;
  }

  .popup-box p {
    margin: 0 0 20px;
    font-size: 14px;
    color: #666;
  }

  .popup-box button {
    width: 100%;
    padding: 12px 0;
    border-radius: 12px;
    border: none;
    background: #111;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }

  .popup-box button:hover {
    opacity: .92;
  }

  @keyframes applePop {
    from { transform: scale(.92); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

// ===== FUNÇÕES =====
function abrirErroProduto() {
  popupErro.style.display = 'block';
}

function fecharErroProduto() {
  popupErro.style.display = 'none';
  inputProd.focus();
}

document.getElementById('btn-ok-erro').onclick = fecharErroProduto;
popupErro.style.display = 'none';

// clicar fora fecha (apple-like)
popupErro.addEventListener('click', e => {
  if (e.target.classList.contains('popup-overlay')) {
    fecharErroProduto();
  }
});

// ===== FLUXO ENTER NO INPUT PRODUTO (MESMA LÓGICA) =====
inputProd.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;

  e.preventDefault();

  const codigo = inputProd.value.trim();
  if (!codigo) return;

  // ❌ NÃO EXISTE
  if (!produtosDB[codigo]) {
    abrirErroProduto();
    return;
  }

  // ✅ EXISTE
  produtoAtual = produtosDB[codigo];

  inputPreco.value = produtoAtual.preco
    .toFixed(2)
    .replace('.', ',');

  inputQtd.focus();
  inputQtd.select();
  calcularSubtotal();
});