const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('Equipo', {
    ID_Equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Marca_Equipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Modelo_Equipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Tipo_Equipo_FK: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NumeroSerie_Equipo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    Estado_Equipo: {
        type: DataTypes.ENUM('Activo', 'En reparación', 'Retirado'),
        defaultValue: 'Activo'
    }
}, {
    tableName: 'Equipo',
    timestamps: false
});


// Método personalizado para obtener todos los equipos
Equipo.getAll = async () => {
    try {
        const equipos = await Equipo.findAll(); // Consulta todos los registros
        console.log("//ESTOS SON TODOS LOS EQUIPOS");
        console.log(equipos);
        return equipos;
    } catch (error) {
        throw error;
    }
};


module.exports = Equipo;
