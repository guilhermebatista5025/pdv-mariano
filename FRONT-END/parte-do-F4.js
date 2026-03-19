// =====================================================
// 9. MODAL DE RELATÓRIO (PARTE DO F4 & PASSANDO ODIO)
// =====================================================

window.addEventListener('keydown', function(event) {
    if (event.key === "F4" || event.keyCode === 115) {
        event.preventDefault();

        let modal = document.getElementById('caixa-modal-pdv');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'caixa-modal-pdv';
            modal.innerHTML = `
                <div style="background: #f0f0f0; width: 1200px; height: 750px; border: 3px solid #444; box-shadow: 10px 10px 30px rgba(0,0,0,0.5); font-family: 'Segoe UI', Tahoma, sans-serif; display: flex; flex-direction: column; overflow: hidden;">
                    
                    <div style="background: linear-gradient(to bottom, #ddd, #bbb); padding: 10px 20px; border-bottom: 2px solid #888; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #000; align-items: center;">
                        <span>Fesasys: FEM - Fechamento de Caixa Administrativo</span>
                        <span style="cursor:pointer; background: #f00; color: #fff; padding: 2px 10px; border-radius: 3px; font-size: 14px;" onclick="document.getElementById('caixa-modal-pdv').style.display='none'">X</span>
                    </div>

                    <div style="display: flex; flex: 1; padding: 40px; gap: 50px; align-items: flex-start;">
                        
                        <div style="flex: 1; height: 100%; display: flex; flex-direction: column; gap: 20px; border-right: 2px solid #ccc; padding-right: 40px;">
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; background: #e8e8e8; padding: 20px; border-radius: 8px; border: 1px solid #ccc;">
                                <div style="font-size: 16px;"><small style="color:#555; font-weight: bold;">OPERAÇÃO</small><br><strong style="font-size: 20px;">2090</strong></div>
                                <div style="font-size: 16px;"><small style="color:#555; font-weight: bold;">OPERADOR</small><br><strong style="color: blue; font-size: 20px;">GLAUCIA</strong></div>
                                <div style="font-size: 16px;"><small style="color:#555; font-weight: bold;">DATA ABERTURA</small><br><strong style="font-size: 20px;">07/02/2026</strong></div>
                                <div style="font-size: 16px;"><small style="color:#555; font-weight: bold;">HORA ABERTURA</small><br><strong style="color: blue; font-size: 20px;">08:32:59</strong></div>
                            </div>

                            <p style="margin: 20px 0 10px 0; font-weight: bold; font-size: 18px; color: #333;">Valores Por Condição de Pagamento</p>
                            
                            <div style="flex: 1; background: white; border: 2px solid #999; overflow-y: auto;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                                    <tr style="background: #000080; color: white; text-align: left; position: sticky; top: 0;">
                                        <th style="padding: 12px; border: 1px solid #999;">CONDIÇÃO</th>
                                        <th style="padding: 12px; border: 1px solid #999; text-align: right;">VALOR ACUMULADO (R$)</th>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 12px;">DINHEIRO</td><td style="padding: 12px; text-align: right; font-weight: bold;">329,80</td></tr>
                                    <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 12px;">CARTÃO DE CRÉDITO</td><td style="padding: 12px; text-align: right; font-weight: bold;">0,00</td></tr>
                                    <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 12px;">CARTÃO DE DÉBITO</td><td style="padding: 12px; text-align: right; font-weight: bold;">0,00</td></tr>
                                    <tr style="border-bottom: 1px solid #ddd; background: #e0ffe0;"><td style="padding: 12px;">PIX / TRANSFERÊNCIA</td><td style="padding: 12px; text-align: right; font-weight: bold;">0,00</td></tr>
                                    <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 12px;">CONVÊNIO / PRAZO</td><td style="padding: 12px; text-align: right; font-weight: bold;">0,00</td></tr>
                                </table>
                            </div>
                        </div>

                        <div style="flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                                <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                                    <span style="font-size: 16px; color: #444;">Fundo de Caixa (=)</span><br>
                                    <strong style="color:blue; font-size: 26px;">0,00</strong>
                                </div>
                                <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                                    <span style="font-size: 16px; color: #444;">Vendas Bruta (=)</span><br>
                                    <strong style="color:blue; font-size: 26px;">329,80</strong>
                                </div>
                                <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                                    <span style="font-size: 16px; color: #444;">Cancelamentos (-)</span><br>
                                    <strong style="color:red; font-size: 26px;">0,00</strong>
                                </div>
                                <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                                    <span style="font-size: 16px; color: #444;">Descontos (-)</span><br>
                                    <strong style="color:red; font-size: 26px;">0,00</strong>
                                </div>
                                <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                                    <span style="font-size: 16px; color: #444;">Suprimentos (+)</span><br>
                                    <strong style="color:green; font-size: 26px;">0,00</strong>
                                </div>
                                <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                                    <span style="font-size: 16px; color: #444;">Sangrias (-)</span><br>
                                    <strong style="color:red; font-size: 26px;">0,00</strong>
                                </div>
                            </div>
                            
                            <div style="background: #c1f0c1; padding: 25px; border: 2px solid #5a5; display: flex; justify-content: space-between; align-items: center; border-radius: 8px;">
                                <span style="font-size: 22px; font-weight: bold; color: #262;">Vendas Líquida (=)</span>
                                <strong style="font-size: 36px; color: blue;">329,80</strong>
                            </div>

                            <div style="background: #eee; padding: 30px; border-top: 4px double #999; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 30px; font-weight: bold; color: #000;">TOTAL GERAL (=)</span>
                                <strong style="font-size: 50px; color: #000080; text-shadow: 1px 1px 2px #aaa;">329,80</strong>
                            </div>
                        </div>
                    </div>

                    <div style="background: #ccc; padding: 25px; border-top: 2px solid #888; display: flex; justify-content: center; gap: 30px;">
                        <button style="padding: 15px 30px; font-size: 16px; font-weight: bold; cursor: pointer; background: #e0e0e0; border: 2px solid #777;">[F1] FECHAR CAIXA</button>
                        <button style="padding: 15px 30px; font-size: 16px; font-weight: bold; cursor: pointer; background: #e0e0e0; border: 2px solid #777;">[F2] IMPRIMIR</button>
                        <button onclick="document.getElementById('caixa-modal-pdv').style.display='none'" style="padding: 15px 30px; font-size: 16px; font-weight: bold; cursor: pointer; background: #e0e0e0; border: 2px solid #777;">[ESC] RETORNAR</button>
                    </div>
                </div>
            `;
            
            Object.assign(modal.style, {
                position: 'fixed', inset: '0', zIndex: '9999999',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)'
            });

            document.body.appendChild(modal);
        } else {
            modal.style.display = (modal.style.display === 'none') ? 'flex' : 'none';
        }
    }

    if (event.key === "Escape") {
        const modal = document.getElementById('caixa-modal-pdv');
        if (modal) modal.style.display = 'none';
    }
});