const express = require('express');
const path = require('path');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para el menú de administradores
router.get('/menu-admin', verifyToken, verifyRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'menu-admin.html'));
});

// Ruta para el menú de usuarios
router.get('/menu-usuario', verifyToken, verifyRole('user'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'menu-usuario.html'));
});

module.exports = router;
