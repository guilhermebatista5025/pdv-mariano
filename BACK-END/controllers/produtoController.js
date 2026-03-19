const db = require('../database'); // Importa a conexão com o mariano.db

exports.listarProdutos = (req, res) => {
    const sql = "SELECT * FROM produtos_cadastrados";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.cadastrarProduto = (req, res) => {
    const { nome, codigo_barras, preco_venda, estoque_atual } = req.body;
    const sql = `INSERT INTO produtos_cadastrados (nome, codigo_barras, preco_venda, estoque_atual) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [nome, codigo_barras, preco_venda, estoque_atual], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: "Sucesso!" });
    });
};
