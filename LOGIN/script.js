document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. Lógica do Olho (Senha) ===
    const senhaInput = document.getElementById('senha');
    const btnOlho = document.getElementById('toggle-senha');

    if (btnOlho && senhaInput) {
        btnOlho.onclick = function() {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                this.innerText = '🙈';
            } else {
                senhaInput.type = 'password';
                this.innerText = '👁️';
            }
        };
    }

    // === 2. Relógio ===
    function atualizarRelogio() {
        const agora = new Date();
        const h = document.getElementById('hora-atual');
        const d = document.getElementById('data-atual');
        const f = document.getElementById('timestamp-footer');

        if (h) h.innerText = agora.toLocaleTimeString('pt-BR');
        if (d) d.innerText = agora.toLocaleDateString('pt-BR');
        if (f) f.innerText = agora.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'medium' });
    }

    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    // === 3. Lógica Visual de Identificação (Operador 1 ou 2) ===
    const inputOperador = document.getElementById('operador');
    const areaMensagem = document.getElementById('mensagem-boas-vindas');

    if (inputOperador && areaMensagem) {
        inputOperador.addEventListener('input', function() {
            const valor = this.value.trim();
            areaMensagem.classList.remove('show');

            if (valor === '1') {
                areaMensagem.style.color = "#105ba6";
                areaMensagem.innerText = "👨‍💻 SEJA BEM VINDO PROGRAMADOR ( ADM )";
                setTimeout(() => areaMensagem.classList.add('show'), 10);
            } 
            else if (valor === '2') {
                areaMensagem.style.color = "#f39200";
                areaMensagem.innerText = "🛠️ SEJA BEM VINDO MARIANO ( GESTOR )";
                setTimeout(() => areaMensagem.classList.add('show'), 10);
            } 
            else {
                areaMensagem.innerText = "";
            }
        });
    }

    // === 4. Botão Iniciar (LOGIN REAL) ===
    const btnIniciar = document.getElementById('btn-iniciar');
    
    if (btnIniciar) {
        btnIniciar.onclick = async function() {
            const operador = document.getElementById('operador').value.trim();
            const senha = document.getElementById('senha').value.trim();

            if (!operador || !senha) {
                return alert("Por favor, digite o operador e a senha!");
            }

            try {
                // Chamada para a API do seu Back-end
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        codigo_operador: operador, 
                        senha: senha 
                    })
                });

                const dados = await response.json();

                if (response.ok) {
                    // Salva os dados do usuário no navegador (Sessão)
                    localStorage.setItem('usuario', JSON.stringify(dados.user));
                    
                    alert(`✅ Login realizado! Bem-vindo, ${dados.user.nome}`);

                    // Redireciona para a tela principal do PDV
                    window.location.href = '/vendas'; 
                } else {
                    // Exibe a mensagem de erro que vem do Controller (ex: "Senha incorreta")
                    alert(dados.message || "Erro ao acessar o sistema.");
                }

            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("❌ Erro de conexão! Verifique se o servidor está rodando.");
            }
        };
    }
});