const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Quando o front pedir GET /api/produtos
router.get('/', produtoController.listarProdutos);

// Quando o front enviar POST /api/produtos
router.post('/', produtoController.cadastrarProduto);

module.exports = router;