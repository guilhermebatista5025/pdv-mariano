const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Importar as rotas
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

// 2. Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. ROTA PRINCIPAL (Vem ANTES de qualquer pasta estática)
// Quando o usuário digitar apenas "localhost:3000", ele cai aqui:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../LOGIN', 'index.html'));
});

// 4. Rotas de API
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);

// Arquivos da tela principal (Vendas) ficam na raiz "/"
app.use('/', express.static(path.join(__dirname, '../FRONT-END')));

// Arquivos da tela de LOGIN ficam no prefixo "/auth-assets"
// Isso evita que o style.css do login atropele o style.css das vendas
app.use('/auth-assets', express.static(path.join(__dirname, '../LOGIN')));

// Rota principal: entrega o HTML de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../LOGIN', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🔑 Tela de Login forçada como principal.`);
});


