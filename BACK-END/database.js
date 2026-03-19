const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ajustando para entrar na pasta 'database' e depois pegar o arquivo
const dbPath = path.join(__dirname, 'database', 'mariano.db');

console.log("🔍 Buscando banco em:", dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("❌ Erro: Não achei o arquivo na pasta 'database'.", err.message);
    } else {
        console.log("✅ Conectado com sucesso ao mariano.db dentro da pasta database!");
    }
});

module.exports = db;