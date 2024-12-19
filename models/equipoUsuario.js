const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Equipo = require('./equipo');
const Usuario = require('./user');

const EquipoUsuario = sequelize.define('EquipoUsuario', {
    ID_Equipo_FK: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ID_Usuario_FK: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    Fecha_Asignacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Fecha_Devolucion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'Equipo_Usuario',
    timestamps: false
});


module.exports = EquipoUsuario;
