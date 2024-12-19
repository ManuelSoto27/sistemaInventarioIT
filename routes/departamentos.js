const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departamentosController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, departmentsController.getAllDepartments);
router.post('/create', verifyToken, departmentsController.createDepartment);
router.put('/edit', verifyToken, departmentsController.editDepartment);
router.delete('/delete/:id', verifyToken, departmentsController.deleteDepartment);

module.exports = router;
