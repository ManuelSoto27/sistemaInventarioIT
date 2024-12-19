const { Op } = require('sequelize'); // Operadores de Sequelize
const Equipo = require('../models/equipo');
const TipoEquipo = require('../models/tipoEquipo'); // Para relaciones
const User = require('../models/user'); // Para relaciones
const EquipoUsuario = require('../models/equipoUsuario'); // Para relaciones
const { Sequelize } = require('sequelize');


const equiposController = {
  getAllEquipos: async (req, res) => {
    try {
      // Obtener los equipos junto con la información del usuario asignado
      const equipos = await Equipo.findAll({
        include: [
          {
            model: TipoEquipo,
            as: 'tipoEquipo',
            attributes: ['Nombre_Tipo_Equipo'],
          },
          {
            model: EquipoUsuario,
            as: 'usuariosAsignados', // Alias para la relación intermedia
            include: [
              {
                model: User,
                as: 'usuario', // Alias para el usuario asignado
                attributes: ['Nombre_Usuario', 'ApellidoPaterno_Usuario'],
              }
            ]
          }
        ]
      });

      console.log(JSON.stringify(equipos, null, 2));


        // Obtener todos los tipos de equipo para los dropdowns
        const tiposEquipo = await TipoEquipo.findAll({
            attributes: ['ID_Tipo_Equipo', 'Nombre_Tipo_Equipo']
        });

        res.render('base', { 
            title: 'Lista de Equipos', 
            role: req.user.role,
            content: 'equipos',
            equipos, // Enviar los datos de equipos a la vista
            tiposEquipo // Enviar los tipos de equipo a la vista
        });
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        res.status(500).send('Error interno del servidor');
    }
},

  createEquipo: async (req, res) => {
    try {
      const { Marca_Equipo, Modelo_Equipo, Tipo_Equipo_FK, NumeroSerie_Equipo, Estado_Equipo } = req.body;
  
      const newEquipo = await Equipo.create({
        Marca_Equipo,
        Modelo_Equipo,
        Tipo_Equipo_FK,
        NumeroSerie_Equipo,
        Estado_Equipo
      });
  
      // Devolvemos un objeto con éxito y el nuevo equipo
      res.status(200).json({ success: true, equipo: newEquipo });
      console.log("Equipo creado exitosamente", newEquipo);
    } catch (error) {
      console.error('Error al crear el equipo:', error);
      res.status(500).json({ success: false, message: 'Error al crear el equipo' });
    }
  },
  editEquipo: async (req, res) => {
    try {
      const { ID_Equipo, Marca_Equipo, Modelo_Equipo, Tipo_Equipo_FK, NumeroSerie_Equipo, Estado_Equipo } = req.body;
      console.log("Controlador recibiendo equipo:" , req.body)
      console.log("Controlador buscando equipo por ID:" , ID_Equipo)
      const equipo = await Equipo.findByPk(ID_Equipo);
      if (equipo) {
        equipo.Marca_Equipo = Marca_Equipo;
        equipo.Modelo_Equipo = Modelo_Equipo;
        equipo.Tipo_Equipo_FK = Tipo_Equipo_FK;
        equipo.NumeroSerie_Equipo = NumeroSerie_Equipo;
        equipo.Estado_Equipo = Estado_Equipo;
        await equipo.save();
        res.status(200).json({ success: true, message: 'Equipo editado exitosamente' }); // Respuesta JSON de éxito
      } else {
        res.status(404).json({ success: false, message: 'Equipo no encontrado' });
      }
    } catch (error) {
      console.error('Error al editar el equipo:', error);
      res.status(500).json({ success: false, message: 'Error al editar el equipo' });
    }
  },

  deleteEquipo: async (req, res) => {
    try {
      const { ID_Equipo } = req.params;
      const equipo = await Equipo.findByPk(ID_Equipo);
      
      if (equipo) {
        await equipo.destroy();
        res.status(200).json({ success: true, message: 'Equipo eliminado' }); // Respuesta con éxito
      } else {
        res.status(404).json({ success: false, message: 'Equipo no encontrado' }); // Si no encuentra el equipo
      }
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar el equipo' }); // Error del servidor
    }
  },

  // Función para búsqueda de equipos
searchEquipos: async (req, res) => {
  try {
    const { query } = req.query;
    let equipos;

    const includeConfig = [
      {
        model: TipoEquipo,
        as: 'tipoEquipo',
        attributes: ['Nombre_Tipo_Equipo']
      },
      {
        model: EquipoUsuario,
        as: 'usuariosAsignados', 
        attributes: ['ID_Usuario_FK', 'Fecha_Asignacion', 'Fecha_Devolucion'],
        include: [
          {
            model: User,
            as: 'usuario',
            attributes: ['Nombre_Usuario', 'ApellidoPaterno_Usuario']
          }
        ]
      }
    ];

    if (!query) {
      // Si no hay parámetro de búsqueda, devuelve todos los equipos
      equipos = await Equipo.findAll({ include: includeConfig });
    } else {
      // Busca equipos filtrados por Marca o Modelo
      equipos = await Equipo.findAll({
        where: {
          [Op.or]: [
            { Marca_Equipo: { [Op.like]: `%${query}%` } },
            { Modelo_Equipo: { [Op.like]: `%${query}%` } }
          ]
        },
        include: includeConfig
      });
    }

    if (!Array.isArray(equipos)) {
      console.error('La consulta no devolvió un array:', equipos);
      return res.status(500).json({ success: false, message: 'Formato inesperado en la respuesta' });
    }

    res.status(200).json(equipos);
  } catch (error) {
    console.error('Error al buscar equipos:', error);
    res.status(500).json({ success: false, message: 'Error al buscar equipos' });
  }
},

// Controlador para contar equipos por estado
countEquiposByEstado: async (req, res) => {
  try {
    const estados = await Equipo.findAll({
      attributes: ['Estado_Equipo', [Sequelize.fn('COUNT', Sequelize.col('Estado_Equipo')), 'count']],
      group: ['Estado_Equipo']
    });

    const result = estados.reduce((acc, estado) => {
      acc[estado.Estado_Equipo] = estado.dataValues.count;
      return acc;
    }, {});

    res.status(200).json({
      Activo: result['Activo'] || 0,
      EnReparacion: result['En reparación'] || 0,
      Retirado: result['Retirado'] || 0
    });
  } catch (error) {
    console.error('Error al contar equipos por estado:', error);
    res.status(500).json({ success: false, message: 'Error al contar equipos por estado' });
  }
}

};


module.exports = equiposController;
