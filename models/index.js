const User = require('./user');
const Equipo = require('./equipo');
const Departamento = require('./departamento');
const TipoEquipo = require('./tipoEquipo');
const EquipoUsuario = require('./equipoUsuario');

User.belongsTo(Departamento, { foreignKey: 'Departamento_Usuario_FK', as: 'departamento' });
Departamento.hasMany(User, { foreignKey: 'Departamento_Usuario_FK', as: 'usuarios' });

Equipo.belongsTo(TipoEquipo, { foreignKey: 'Tipo_Equipo_FK', as: 'tipoEquipo' });
TipoEquipo.hasMany(Equipo, { foreignKey: 'Tipo_Equipo_FK', as: 'equipos' });

EquipoUsuario.belongsTo(User, { foreignKey: 'ID_Usuario_FK', as: 'usuario' });
User.hasMany(EquipoUsuario, { foreignKey: 'ID_Usuario_FK', as: 'equiposAsignados' });

EquipoUsuario.belongsTo(Equipo, { foreignKey: 'ID_Equipo_FK', as: 'equipo' });
Equipo.hasMany(EquipoUsuario, { foreignKey: 'ID_Equipo_FK', as: 'usuariosAsignados' });

module.exports = {
    User,
    Equipo,
    Departamento,
    TipoEquipo,
    EquipoUsuario
};
