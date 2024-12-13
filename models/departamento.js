const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Departamento = sequelize.define('Departamento', {
    ID_Departamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre_Departamento: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'Departamentos',
    timestamps: false
});

module.exports = Departamento;
