const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { 
        Nombre_Usuario, 
        ApellidoPaterno_Usuario, 
        ApellidoMaterno_Usuario, 
        Correo_Usuario, 
        Password_Usuario, 
        Role_Usuario, 
        Departamento_Usuario_FK, 
        Puesto_Usuario, 
        Estado_Usuario 
    } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ where: { Correo_Usuario } });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Crear el usuario
        const newUser = await User.create({
            Nombre_Usuario,
            ApellidoPaterno_Usuario,
            ApellidoMaterno_Usuario,
            Correo_Usuario,
            Password_Usuario, // Asegúrate de encriptar la contraseña en el modelo.
            Role_Usuario,
            Departamento_Usuario_FK,
            Puesto_Usuario,
            Estado_Usuario
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { Correo_Usuario, Password_Usuario } = req.body;
        const user = await User.findOne({ where: { Correo_Usuario } });

        console.log('Usuario haciendo login:', user.toJSON());

        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const isPasswordValid = await bcrypt.compare(Password_Usuario, user.Password_Usuario);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Generar token
        const token = jwt.sign(
            { userId: user.ID_Usuario, role: user.Role_Usuario},
            'your_jwt_secret',
            { expiresIn: '1h' }
        );


        // Determinar redirección según el rol
        const redirectUrl = user.Role_Usuario === 'admin' ? '/users/menu-admin' : '/users/menu-usuario';

        res.cookie('token', token, { httpOnly: true }); // Almacena el token en una cookie
        res.json({ message: 'Login exitoso', redirectUrl }); // Devuelve la URL de redirección
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};


exports.redirigirMenu = (req, res) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("no se encontro un token")
        return res.status(403).json({ error: 'Token requerido' });
        
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const role = decoded.role;

        // Redirige según el rol del usuario
        let redirectUrl;
        console.log("Rol detectado: " + role)
        if (role === 'admin') {
            redirectUrl = '/users/menu-admin';
        } else if (role === 'user') {
            redirectUrl = '/users/menu-usuario';
        } else {
            console.log("Rol invalido")
            return res.status(403).json({ error: 'Rol no permitido' });
        }

        res.cookie('token', token, {
            httpOnly: true, // Hace la cookie inaccesible desde JavaScript
            secure: false,  // Cambia a true si usas HTTPS
            sameSite: 'strict'
        });
        res.json({ redirectUrl });
        
    } catch (error) {
        console.log("Error al verificar token:" + error)
        console.error('Error al verificar token:', error);
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};



exports.changePassword = async (req, res) => {
    const { userID } = req.params;
    const { newPassword } = req.body;

    try {
        // Encontrar el usuario
        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar la contraseña
        user.Password_Usuario = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
    }
};
