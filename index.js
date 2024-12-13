const express = require('express');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const equipoRoutes = require('./routes/equipos');
const cookieParser = require('cookie-parser'); // Importa cookie-parser
const path = require('path');

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta donde estarán las vistas



// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // Registra cookie-parser como middleware

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});


/*
const equipoRoutes = require('./routes/equipos');
const departamentoRoutes = require('./routes/departamentos');
const tipoEquipoRoutes = require('./routes/tipoEquipos');
const equipoUsuarioRoutes = require('./routes/equipoUsuario');
*/

app.use(express.json());
// Rutas de autenticación
app.use('/auth', authRoutes);
// Rutas de usuarios (requiere autenticación)
app.use('/users', userRoutes);

app.use('/equipos', equipoRoutes);



// Rutas para los menus principales
//app.use('/menus', menuRoutes); 


/*
app.use('/departamentos', departamentoRoutes);
app.use('/tipoEquipos', tipoEquipoRoutes);
app.use('/equipoUsuario', equipoUsuarioRoutes);
*/
 
// Probar la conexión sin sincronizar:
sequelize.authenticate().then(() => {
    console.log('Conexión a la base de datos establecida correctamente');
    app.listen(3000, () => {
        console.log('Servidor escuchando en http://localhost:3000');
    });
}).catch(error => console.error('No se pudo conectar a la base de datos:', error));
