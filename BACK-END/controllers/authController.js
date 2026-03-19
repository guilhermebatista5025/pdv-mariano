const db = require('../database');

exports.login = (req, res) => {
    const { codigo_operador, senha } = req.body;
    
    console.log("--- Tentativa de Login ---");
    console.log("Recebido do Front:", { codigo_operador, senha });

    const sql = "SELECT * FROM usuarios WHERE codigo_operador = ?";
    
    db.get(sql, [codigo_operador], (err, user) => {
        if (err) {
            console.error("❌ ERRO DE SQL:", err.message);
            return res.status(500).json({ message: "Erro no banco: " + err.message });
        }
        
        if (!user) {
            console.log("⚠️ Usuário não encontrado.");
            return res.status(401).json({ message: "Operador não cadastrado!" });
        }

        if (String(user.senha) === String(senha)) {
            console.log("🎉 Senha correta!");
            res.json({
                message: "Sucesso",
                user: { nome: user.nome, nivel: user.nivel_acesso }
            });
        } else {
            console.log("❌ Senha incorreta.");
            res.status(401).json({ message: "Senha incorreta!" });
        }
    }); 
};