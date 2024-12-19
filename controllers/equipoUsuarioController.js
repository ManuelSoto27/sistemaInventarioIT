const { Op } = require('sequelize');

const Equipo = require('../models/equipo');
const EquipoUsuario = require('../models/equipoUsuario');
const Usuario = require('../models/user');

module.exports = {
    getAsignaciones: async (req, res) => {
        try {
            const { idUsuario } = req.params;
    
            // Obtener información del usuario
            const usuario = await Usuario.findByPk(idUsuario);
    
            if (!usuario) {
                return res.status(404).send('Usuario no encontrado');
            }
    
            console.log(`Usuario encontrado: ${JSON.stringify(usuario.dataValues, null, 2)}`);
            // Obtener equipos asignados al usuario
            const equiposAsignados = await EquipoUsuario.findAll({
                where: { ID_Usuario_FK: idUsuario },
                include: [
                    {
                        model: Equipo,
                        as: 'equipo', // Alias definido en la asociación
                    },
                ],
            });
    
            // Extraer los IDs de equipos ya asignados
            const idsAsignados = equiposAsignados.map(ea => ea.ID_Equipo_FK);
    
            // Obtener equipos no asignados
            const equiposNoAsignados = await Equipo.findAll({
                where: {
                    ID_Equipo: { [Op.notIn]: idsAsignados },
                    // Asegurarse de que no estén asignados a otro usuario
                },
                include: [
                    {
                        model: EquipoUsuario,
                        as: 'usuariosAsignados', // El alias correcto de la relación
                        where: { ID_Usuario_FK: null }, // Asegurar que no está asignado a ningún usuario
                        required: false, // Permitir que los equipos no asignados sean seleccionados
                    }
                ],
            });
    
            // Renderizar vista con todos los datos necesarios
            res.render('base', {
                title: `Equipos asignados al usuario ${usuario.Nombre_Usuario + " " + usuario.ApellidoPaterno_Usuario }`, // Título dinámico
                usuario, // Información del usuario
                equiposAsignados: equiposAsignados.map(ea => ea.equipo), // Extraer los equipos asignados
                equiposNoAsignados, // Equipos no asignados
                role: req.user.role,
                content:'equipoUsuario'
            });
        } catch (error) {
            console.error('Error al obtener asignaciones:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    asignarEquipo: async (req, res) => {
        const { idUsuario, idEquipo } = req.body;
        console.log(req.body);
    
        try {
            // Validar que el equipo no esté asignado a otro usuario
            const existeAsignacion = await EquipoUsuario.findOne({ where: { ID_Equipo_FK: idEquipo, Fecha_Devolucion: null } });
            if (existeAsignacion) {
                return res.status(400).send('El equipo ya está asignado a otro usuario.');
            }
    
            // Crear asignación
            await EquipoUsuario.create({
                ID_Equipo_FK: idEquipo,
                ID_Usuario_FK: idUsuario,
                Fecha_Asignacion: new Date(),
            });
    
            res.redirect(`/equipoUsuario/${idUsuario}`);
        } catch (error) {
            console.error('Error al asignar equipo:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    desasignarEquipo: async (req, res) => {
        const { idUsuario, idEquipo } = req.body;

        try {
            await EquipoUsuario.destroy({ where: { ID_Equipo_FK: idEquipo, ID_Usuario_FK: idUsuario } });
            res.redirect(`/equipoUsuario/${idUsuario}`);
        } catch (error) {
            console.error('Error al desasignar equipo:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
};
