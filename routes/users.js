const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const path = require('path');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

//router.get('/', usersController.getAllUsers);
//router.post('/', usersController.createUser);

// Ruta para el menú de administradores
router.get('/menu-admin', verifyToken, verifyRole('admin'), (req, res) => {
        // Renderizar la plantilla base
        res.render('base', {
            title: 'Menú Admin',
            role: req.user.role,
            content: 'menuAdmin', // Asegúrate de que el archivo parcial está correctamente configurado
        });
});

// Ruta para el menú de usuarios
router.get('/menu-usuario', verifyToken, verifyRole('user'), (req, res) => {
    
    res.render('base', {
        title: 'Menú Usuario',
        role: req.user.role,
        content: '<%- include("menu-usuario") %>',
    });
});
module.exports = router;
