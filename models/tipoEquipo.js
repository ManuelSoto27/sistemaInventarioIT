const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoEquipo = sequelize.define('TipoEquipo', {
    ID_Tipo_Equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre_Tipo_Equipo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'Tipo_Equipo',
    timestamps: false
});

module.exports = TipoEquipo;
