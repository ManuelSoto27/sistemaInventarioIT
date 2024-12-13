const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    ID_Usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre_Usuario: DataTypes.STRING,
    ApellidoPaterno_Usuario: DataTypes.STRING,
    ApellidoMaterno_Usuario: DataTypes.STRING,
    Correo_Usuario: {
        type: DataTypes.STRING,
        unique: true
    },
    Departamento_Usuario_FK: DataTypes.INTEGER,
    Puesto_Usuario: DataTypes.STRING,
    Password_Usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Role_Usuario: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    Estado_Usuario: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
    }
}, {
    tableName: 'Usuarios',
    timestamps: false
});

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.Password_Usuario = await bcrypt.hash(user.Password_Usuario, salt);
});

module.exports = User;
