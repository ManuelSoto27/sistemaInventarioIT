const { User, Departamento } = require('../models');
// Listar usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Departamento,
                as: 'departamento', // Relación con el modelo Departamento
                attributes: ['Nombre_Departamento'], // Solo traemos el nombre del departamento
            }
        });        
        const departamentos = await Departamento.findAll(); // Obtener todos los departamentos
        res.render('base', { 
            usuarios: users,
            title: 'Lista de usuarios', 
            role: req.user.role,
            content: 'usuarios',
            departamentos
        });
    } catch (error) {
        console.log(error)
        res.status(500).send('Error al obtener los usuarios');
    }
};

// Crear usuario
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el usuario' });
    }
};

// Editar usuario
exports.editUser = async (req, res) => {
    try {
        const { id } = req.params; // Extraer el ID desde los parámetros de la URL
        console.log("ID de usuario recibido:", id);

        const user = await User.findByPk(id); // Buscar el usuario por el ID recibido
        console.log("Datos recibidos para actualizar:", req.body);

        if (user) {
            // Actualizar los campos enviados en el cuerpo de la solicitud
            await user.update(req.body);
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al editar el usuario:", error);
        res.status(500).json({ success: false, message: 'Error al editar el usuario' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el usuario' });
    }
};
