const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipoEquipoController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');


// Obtener todos los tipos de equipo
router.get('/', verifyToken, tipoEquipoController.getAllTiposEquipo);

// Crear un nuevo tipo de equipo
router.post('/createTipoEquipo', verifyToken, tipoEquipoController.createTipoEquipo);

// Actualizar un tipo de equipo
router.put('/editTipoEquipo/:id', verifyToken, tipoEquipoController.updateTipoEquipo);

// Eliminar un tipo de equipo
router.delete('/deleteTipoEquipo/:id', verifyToken, tipoEquipoController.deleteTipoEquipo);

module.exports = router;
