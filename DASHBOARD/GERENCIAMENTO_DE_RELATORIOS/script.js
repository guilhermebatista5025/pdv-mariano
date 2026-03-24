document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCancelar = document.getElementById('btnCancelar');
    const checkSalvar = document.getElementById('checkSalvar');

    const handleConfirm = () => {
        alert("Relatório gerado com sucesso!");
    };

    const handleCancel = () => {
        if(confirm("Deseja fechar esta janela?")) {
            console.log("Modal fechado");
        }
    };

    btnConfirmar.addEventListener('click', handleConfirm);
    btnCancelar.addEventListener('click', handleCancel);

    // Atalhos do sistema
    window.addEventListener('keydown', (e) => {
        if (e.key === "F1") {
            e.preventDefault();
            handleConfirm();
        }
        if (e.key === "Escape") {
            handleCancel();
        }
        if (e.key === "F2") {
            e.preventDefault();
            checkSalvar.checked = !checkSalvar.checked;
        }
    });
});