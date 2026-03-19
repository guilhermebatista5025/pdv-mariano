// =====================================================
// 10. MODAL MENU PRINCIPAL (LÓGICA REFINADA & INTELIGENTE)
// =====================================================

(function() {
    // 1. Cria o elemento da barra
    const barraLateral = document.createElement('div');
    barraLateral.id = 'barra-f9-injetada';
    
    // 2. Define o conteúdo (Setas e Texto)
    barraLateral.innerHTML = `
        <span style="font-size: 10px;">▲</span>
        <div style="writing-mode: vertical-rl; transform: rotate(180deg); font-weight: bold; font-size: 13px; letter-spacing: 1px;">
            Menu Principal [ F9 ]
        </div>
        <span style="font-size: 10px;">▼</span>
    `;

    // 3. Aplica o Estilo Direto (Estilo Inline não falha)
    Object.assign(barraLateral.style, {
        position: 'fixed',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '30px',
        height: '320px',
        backgroundColor: '#3b429f', // Azul da foto
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        zIndex: '9999999',
        cursor: 'pointer',
        borderLeft: '1px solid #2a2f7a',
        fontFamily: 'sans-serif',
        userSelect: 'none'
    });

    // 4. Adiciona o evento de clique para abrir o menu
    barraLateral.onclick = function() {
        console.log("Barra lateral clicada!");
        // Aqui você pode chamar a função que abre o menu do F9
        // Exemplo: abrirMenuF9(); 
    };

    // 5. Joga no Body da página
    document.body.appendChild(barraLateral);
    console.log("Barra F9 injetada com sucesso no canto direito!");
})();

// 1. Função que gera o Menu Moderno
// Função para abrir o menu
const abrirMenuF9 = () => {
    // 1. Tenta achar o menu se ele já existir
    let menu = document.getElementById('menu-principal-f9');

    // 2. Se já existir, apenas alterna entre mostrar e esconder
    if (menu) {
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
        return;
    }

    // 3. Se não existir, cria do zero
    menu = document.createElement('div');
    menu.id = 'menu-principal-f9';
    
    menu.innerHTML = `
        <div class="container-f9">
            <div class="header-f9">
                <h2>Menu Principal</h2>
                <div class="linha-decorativa"></div>
                <p>Escolha a operação desejada</p>
            </div>

            <div class="grid-f9">
                ${renderCard('Pagamento', 'F1', '💰', '#34c759')}
                ${renderCard('Cancelar', 'F2', '❌', '#ff3b30')}
                ${renderCard('Consulta', 'F3', '🔍', '#0071e3')}
                ${renderCard('Outros', 'F5', '📋', '#ff9500')}
                ${renderCard('Fichas', 'F6', '👤', '#af52de')}
                ${renderCard('NFCe', 'F7', '🌐', '#5ac8fa')}
                ${renderCard('Receber', 'F8', '🤲', '#5856d6')}
                ${renderCard('Preços', 'F9', '🏷️', '#ff2d55')}
                ${renderCard('Tele-Ped', 'F10', '📞', '#30b0c7')}
                ${renderCard('Relatórios', 'Ctrl+R', '📄', '#8e8e93')}
                ${renderCard('Busca', 'Ctrl+F', '🔎', '#ffcc00')}
                ${renderCard('Finalizar', 'F11', '🚪', '#000000')}
            </div>

            <div class="footer-f9">
                Pressione <span>ESC</span> para fechar
            </div>
        </div>
    `;

    document.body.appendChild(menu);
};

// Função para gerar os cards
function renderCard(label, tecla, icon, cor) {
    return `
        <div class="card-clean" onclick="console.log('Ação: ${label}')">
            <div class="icon-f9">${icon}</div>
            <div class="label-f9">${label}</div>
            <div class="tecla-f9" style="color: ${cor}">${tecla}</div>
        </div>
    `;
}

// --- EVENTOS ---

// Atalhos de Teclado
window.addEventListener('keydown', (e) => {
    if (e.key === "F9") {
        e.preventDefault();
        abrirMenuF9();
    }
    if (e.key === "Escape") {
        const menu = document.getElementById('menu-principal-f9');
        if (menu) menu.style.display = 'none';
    }
});

// Clique na barra lateral (independente de como ela foi criada)
document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebar-f9') || e.target.closest('#barra-f9-injetada')) {
        abrirMenuF9();
    }
});