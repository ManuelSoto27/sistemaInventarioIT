const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const path = require('path');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const equipoUsuarioController = require('../controllers/equipoUsuarioController');

router.get('/', verifyToken, usersController.getAllUsers);
router.post('/create', verifyToken, usersController.createUser);
router.put('/edit/:id', verifyToken, usersController.editUser);
router.delete('/delete/:id', verifyToken, usersController.deleteUser);


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

    const userId = req.user.userId; // Extraer el ID del usuario del token decodificado
    console.log("Usuario ID en la ruta:", userId);
    
    res.render('base', {
        title: 'Menú Usuario',
        role: req.user.role,
        userId,
        content: 'menuUsuario',
    });
    console.log(req.user)
});

module.exports = router;
