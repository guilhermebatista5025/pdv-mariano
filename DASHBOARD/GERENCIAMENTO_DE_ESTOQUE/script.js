document.addEventListener('DOMContentLoaded', () => {
    // 1. SELEÇÃO DE ELEMENTOS
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.tab-content');
    const btnAbrirModal = document.getElementById('btnAbrirModal');
    const btnFechar = document.getElementById('btnFechar');
    const modal = document.getElementById('modal');
    const btnSalvar = document.getElementById('btnSalvar');
    
    // Mudança aqui: Usando ID para não dar conflito com outros botões
    const btnExportar = document.getElementById('btnExportarPDF'); 
    
    const listaProdutos = document.getElementById('lista-produtos');
    const listaRelatorio = document.getElementById('lista-relatorio');

    // 2. BANCO DE DADOS INICIAL
    let estoque = [
        { nome: 'Gás R134a (13.6kg)', cat: 'Fluidos', custo: 300, markup: 50, qtd: 2 },
        { nome: 'Compressor Embraco 1/4', cat: 'Peças', custo: 280, markup: 40, qtd: 10 }
    ];

    // 3. NAVEGAÇÃO ENTRE ABAS
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === target) sec.classList.add('active');
            });
        });
    });

    // 4. LÓGICA DO MODAL (POP-UP)
    const abrirModal = () => {
        modal.style.display = 'flex';
    };

    const fecharModal = () => {
        modal.style.display = 'none';
        document.querySelectorAll('#modal input').forEach(input => input.value = '');
    };

    window.onclick = (event) => {
        if (event.target == modal) fecharModal();
    };

    // 5. FUNÇÃO DE EXPORTAR PDF
    const exportarPDF = () => {
        console.log("Iniciando geração do PDF...");
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Cabeçalho do PDF
            doc.setFontSize(18);
            doc.setTextColor(26, 58, 90); 
            doc.text("Relatório de Estoque - RefriControl", 14, 20);

            const dataAtual = new Date().toLocaleDateString('pt-BR');
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Gerado em: ${dataAtual}`, 14, 28);

            // Dados
            const colunas = ["Produto", "Categoria", "Qtd", "Custo Unit.", "Preço Venda"];
            const linhas = estoque.map(prod => [
                prod.nome,
                prod.cat,
                prod.qtd,
                `R$ ${prod.custo.toFixed(2)}`,
                `R$ ${(prod.custo * (1 + prod.markup/100)).toFixed(2)}`
            ]);

            doc.autoTable({
                startY: 35,
                head: [colunas],
                body: linhas,
                headStyles: { fillColor: [26, 58, 90] },
                alternateRowStyles: { fillColor: [238, 242, 246] },
            });

            doc.save(`relatorio_${dataAtual.replace(/\//g, '-')}.pdf`);
            console.log("PDF baixado com sucesso!");
        } catch (error) {
            console.error("Erro ao gerar PDF. Verifique se as bibliotecas estão no HTML.", error);
            alert("Erro ao gerar PDF. Verifique o console.");
        }
    };

    // 6. RENDERIZAÇÃO GERAL
    const renderizar = () => {
        listaProdutos.innerHTML = '';
        if (listaRelatorio) listaRelatorio.innerHTML = '';

        let lucroTotal = 0;
        let custoTotal = 0;
        let faturamentoBruto = 0;
        let alertas = 0;

        estoque.forEach((prod) => {
            const lucroUnitario = prod.custo * (prod.markup / 100);
            const precoVenda = prod.custo + lucroUnitario;
            const lucroTotalProd = lucroUnitario * prod.qtd;
            const custoTotalProd = prod.custo * prod.qtd;
            const faturamentoProd = precoVenda * prod.qtd;

            lucroTotal += lucroTotalProd;
            custoTotal += custoTotalProd;
            faturamentoBruto += faturamentoProd;

            let statusTxt = 'Em Estoque';
            let statusCls = 'in-stock';
            if (prod.qtd <= 0) { 
                statusTxt = 'Em Falta'; statusCls = 'out-of-stock'; alertas++; 
            } else if (prod.qtd <= 5) { 
                statusTxt = 'Baixo Estoque'; statusCls = 'low-stock'; alertas++; 
            }

            const trEstoque = document.createElement('tr');
            trEstoque.innerHTML = `
                <td>${prod.nome}</td>
                <td>${prod.cat}</td>
                <td>${prod.qtd}</td>
                <td><span class="status ${statusCls}">${statusTxt}</span></td>
                <td>${precoVenda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
            `;
            listaProdutos.appendChild(trEstoque);

            if (listaRelatorio) {
                const trRel = document.createElement('tr');
                trRel.innerHTML = `
                    <td><strong>${prod.nome}</strong></td>
                    <td>${prod.qtd} un.</td>
                    <td>${custoTotalProd.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                    <td><span style="color: #15803d; font-weight: bold;">${prod.markup}%</span></td>
                    <td>${lucroTotalProd.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                `;
                listaRelatorio.appendChild(trRel);
            }
        });

        // Atualizar Painel
        document.getElementById('ganho-total').innerText = lucroTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        document.getElementById('total-custo-painel').innerText = custoTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        document.getElementById('total-venda-painel').innerText = faturamentoBruto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        const cardAlerta = document.getElementById('alerta-qtd');
        if(cardAlerta) cardAlerta.innerText = alertas;

        // Atualizar Relatórios
        if (document.getElementById('rel-faturamento')) {
            document.getElementById('rel-faturamento').innerText = faturamentoBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('rel-investimento').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('rel-lucro').innerText = lucroTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    };

    // 7. EVENTO SALVAR
    btnSalvar.addEventListener('click', () => {
        const nome = document.getElementById('nome').value;
        const cat = document.getElementById('categoria').value;
        const custo = parseFloat(document.getElementById('custo').value);
        const markup = parseFloat(document.getElementById('markup').value);
        const qtd = parseInt(document.getElementById('estoque').value);

        if (!nome || !cat || isNaN(custo) || isNaN(markup) || isNaN(qtd)) {
            alert('Preencha todos os campos corretamente!');
            return;
        }

        estoque.push({ nome, cat, custo, markup, qtd });
        renderizar();
        fecharModal();
    });

    // 8. LISTENERS
    btnAbrirModal.addEventListener('click', abrirModal);
    btnFechar.addEventListener('click', fecharModal);
    
    if (btnExportar) {
        btnExportar.addEventListener('click', (e) => {
            e.preventDefault();
            exportarPDF();
        });
    }

    renderizar();
});