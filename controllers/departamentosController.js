const { Departamento, User } = require('../models');

// Listar departamentos
exports.getAllDepartments = async (req, res) => {
    try {
        const departamentos = await Departamento.findAll();
        res.render('base', { 
            title: 'Gestion de departamentos', 
            role: req.user.role,
            content: 'departamentos',
            departamentos // Envia los datos de equipos a la vista
          });    } catch (error) {
        res.status(500).send('Error al obtener los departamentos');
    }
};

// Crear departamento
exports.createDepartment = async (req, res) => {
    try {
        const { Nombre_Departamento } = req.body;
        const departamento = await Departamento.create({ Nombre_Departamento });
        res.status(201).json({ success: true, departamento });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el departamento' });
    }
};

// Editar departamento
exports.editDepartment = async (req, res) => {
    try {
        const { ID_Departamento, Nombre_Departamento } = req.body;
        const departamento = await Departamento.findByPk(ID_Departamento);
        if (departamento) {
            await departamento.update({ Nombre_Departamento });
            res.status(200).json({ success: true, departamento });
        } else {
            res.status(404).json({ success: false, message: 'Departamento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al editar el departamento' });
    }
};

// Eliminar departamento
exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el departamento existe
        const departamento = await Departamento.findByPk(id);
        if (!departamento) {
            return res.status(404).json({ success: false, message: 'Departamento no encontrado' });
        }

        // Verificar si hay usuarios asignados al departamento
        const usuariosAsignados = await User.count({
            where: { Departamento_Usuario_FK: id }
        });

        if (usuariosAsignados > 0) {
            return res.status(400).json({
                success: false,
                message: `No se puede eliminar el departamento porque hay ${usuariosAsignados} usuario(s) asignado(s).`
            });
        }

        // Eliminar el departamento si no tiene usuarios asignados
        await departamento.destroy();
        res.status(200).json({ success: true, message: 'Departamento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el departamento:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el departamento' });
    }
};
