const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const path = require('path');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const equipoUsuarioController = require('../controllers/equipoUsuarioController');


router.get('/:idUsuario', verifyToken, equipoUsuarioController.getAsignaciones);
router.post('/asignar', verifyToken, equipoUsuarioController.asignarEquipo);
router.post('/desasignar', verifyToken, equipoUsuarioController.desasignarEquipo);


module.exports = router;
