const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');


// Ruta para login
router.post('/login', authController.login);

// Ruta para la pantalla de login
router.get('/login', (req, res) => {
    res.render('login');
});


// Ruta para la pantalla de registrar
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'register.html'));
});

// Ruta para registrar un usuario
router.post('/register', authController.register);

// Ruta para redirigir según el rol
router.get('/redirigirMenu', verifyToken, authController.redirigirMenu);

router.put('/change-password/:userID', authController.changePassword);



module.exports = router;
