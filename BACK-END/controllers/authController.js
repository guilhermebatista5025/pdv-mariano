const db = require('../database');

exports.login = (req, res) => {
    const { codigo_operador, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE codigo_operador = ?";
    
    db.get(sql, [codigo_operador], (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Erro no servidor" });
        }
        
        if (!user) {
            return res.status(401).json({ message: "Operador não cadastrado!" });
        }

        if (String(user.senha) === String(senha)) {
            res.json({
                message: "Sucesso",
                user: { 
                    nome: user.nome, 
                    nivel_acesso: user.nivel_acesso
                }
            });
        } else {
            res.status(401).json({ message: "Senha incorreta!" });
        }
    }); 
};