const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Ruta para listar los equipos
router.get('/', verifyToken, equiposController.getAllEquipos);

// Ruta para crear un nuevo equipo
router.post('/create', verifyToken, equiposController.createEquipo);

// Ruta para editar un equipo
router.put('/edit/:ID_Equipo', verifyToken, equiposController.editEquipo);


// Ruta para eliminar un equipo
router.delete('/delete/:ID_Equipo', verifyToken, equiposController.deleteEquipo);

router.get('/search', verifyToken, equiposController.searchEquipos);

router.get('/countByEstado', equiposController.countEquiposByEstado);


module.exports = router;
