const Equipos = require('../models/equipo');

const equiposController = {
  getAllEquipos: async (req, res) => {
    try {
      const equipos = await Equipos.getAll();
      res.render('equipos', {
        title: 'Listado de Equipos',
        equipos,
      });

      console.log("////////////////////////////////ESTOS SON LOS EQUIPOS DESDE EL CONTROLLER///////////////////////////")
      console.log(equipos)
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
      res.status(500).send('Error al cargar los equipos.');
    }
  },
};

module.exports = equiposController;
