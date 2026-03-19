const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Quando o front bater em /api/auth/login, ele executa a função acima
router.post('/login', authController.login);

module.exports = router;