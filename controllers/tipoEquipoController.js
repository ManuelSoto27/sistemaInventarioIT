const TipoEquipo = require('../models/tipoEquipo');
const Equipo = require('../models/equipo'); // Importar el modelo Equipo

// Obtener todos los tipos de equipos
exports.getAllTiposEquipo = async (req, res) => {
    try {
        const tiposEquipo = await TipoEquipo.findAll();
        res.render('base', { 
            title: 'Lista de categorias', 
            role: req.user.role,
            content: 'tipoEquipo',
            tiposEquipo // Envia los datos de equipos a la vista
          });    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener los tipos de equipo' });
    }
};

// Crear un nuevo tipo de equipo
exports.createTipoEquipo = async (req, res) => {
    const { Nombre_Tipo_Equipo } = req.body;
    try {
        const nuevoTipo = await TipoEquipo.create({ Nombre_Tipo_Equipo });
        res.status(201).json({ message: 'Tipo de equipo creado exitosamente', tipo: nuevoTipo });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al crear el tipo de equipo', error });
    }
};

// Actualizar un tipo de equipo
exports.updateTipoEquipo = async (req, res) => {
    const { id } = req.params;
    const { Nombre_Tipo_Equipo } = req.body;
    try {
        const tipoEquipo = await TipoEquipo.findByPk(id);
        if (tipoEquipo) {
            tipoEquipo.Nombre_Tipo_Equipo = Nombre_Tipo_Equipo;
            await tipoEquipo.save();
            res.status(200).json({ message: 'Tipo de equipo actualizado exitosamente', tipo: tipoEquipo });
        } else {
            res.status(404).json({ message: 'Tipo de equipo no encontrado' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al actualizar el tipo de equipo', error });
    }
};

// Eliminar un tipo de equipo
exports.deleteTipoEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar si hay equipos asignados a este tipo de equipo
        const equiposAsignados = await Equipo.findOne({ where: { Tipo_Equipo_FK: id } });

        if (equiposAsignados) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el tipo de equipo porque tiene equipos asignados.'
            });
        }

        // Si no hay equipos asignados, eliminar el tipo de equipo
        const tipoEquipo = await TipoEquipo.findByPk(id);
        if (tipoEquipo) {
            await tipoEquipo.destroy();
            return res.status(200).json({ success: true, message: 'Tipo de equipo eliminado exitosamente.' });
        } else {
            return res.status(404).json({ success: false, message: 'Tipo de equipo no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar el tipo de equipo:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar el tipo de equipo.' });
    }
};