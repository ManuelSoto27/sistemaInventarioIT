const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

// Ruta para listar los equipos
router.get('/', equiposController.getAllEquipos);

module.exports = router;
