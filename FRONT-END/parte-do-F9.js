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

    // 3. Aplica o Estilo Direto
    Object.assign(barraLateral.style, {
        position: 'fixed',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '30px',
        height: '320px',
        backgroundColor: '#3b429f',
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
        abrirMenuF9(); 
    };

    document.body.appendChild(barraLateral);
})();

// --- LÓGICA DO MENU ---

const abrirMenuF9 = () => {
    let menu = document.getElementById('menu-principal-f9');

    if (menu) {
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
        return;
    }

    menu = document.createElement('div');
    menu.id = 'menu-principal-f9';
    
    // Insira os links desejados no último parâmetro de cada renderCard
    menu.innerHTML = `
        <div class="container-f9">
            <div class="header-f9">
                <h2>Menu Principal</h2>
                <div class="linha-decorativa"></div>
                <p>Escolha a operação desejada</p>
            </div>

            <div class="grid-f9">
                    ${renderCard('Pagamento', 'F1', '💰', '#34c759', '/pagamento')}
                    ${renderCard('Cancelar', 'F2', '❌', '#ff3b30', '/cancelar')}
                    ${renderCard('Consulta', 'F3', '🔍', '#0071e3', '/consulta')}
                    ${renderCard('Outros', 'F5', '📋', '#ff9500', '/outros')}
                    ${renderCard('Fichas', 'F6', '👤', '#af52de', '/fichas')}
                    ${renderCard('NFCe', 'F7', '🌐', '#5ac8fa', '/nfce')}
                    ${renderCard('Receber', 'F8', '🤲', '#5856d6', '/receber')}
                    ${renderCard('Preços', 'F9', '🏷️', '#ff2d55', '/precos')}
                    ${renderCard('Tele-Ped', 'F10', '📞', '#30b0c7', '/tele-ped')}
                    ${renderCard('Relatórios', 'Ctrl+R', '📄', '#8e8e93', '../DASHBOARD/GERENCIAMENTO_DE_RELATORIOS/index.html')}
                    ${renderCard('Busca', 'Ctrl+F', '🔎', '#ffcc00', '/busca')}
                    ${renderCard('Finalizar', 'F11', '🚪', '#000000', '/sair')}
            </div>

            <div class="footer-f9">
                Pressione <span>ESC</span> para fechar
            </div>
        </div>
    `;

    document.body.appendChild(menu);
};

/**
 * @param {string} label - Nome da opção
 * @param {string} tecla - Atalho visual
 * @param {string} icon - Emoji/Ícone
 * @param {string} cor - Cor do atalho
 * @param {string} url - Link para onde vai redirecionar
 */
function renderCard(label, tecla, icon, cor, url) {
    return `
        <div class="card-clean" 
             onclick="window.location.href='${url}'" 
             style="cursor: pointer;">
            <div class="icon-f9">${icon}</div>
            <div class="label-f9">${label}</div>
            <div class="tecla-f9" style="color: ${cor}">${tecla}</div>
        </div>
    `;
}

// --- EVENTOS ---

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

document.addEventListener('click', (e) => {
    if (e.target.closest('#barra-f9-injetada')) {
        abrirMenuF9();
    }
});