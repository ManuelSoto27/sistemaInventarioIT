const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { Nombre_Usuario, ApellidoPaterno_Usuario, ApellidoMaterno_Usuario, Correo_Usuario, Password_Usuario, Role_Usuario } = req.body;
    try {
        const newUser = await User.create({
            Nombre_Usuario,
            ApellidoPaterno_Usuario,
            ApellidoMaterno_Usuario,
            Correo_Usuario,
            Password_Usuario,
            Role_Usuario
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { Correo_Usuario, Password_Usuario } = req.body;
        const user = await User.findOne({ where: { Correo_Usuario } });

        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const isPasswordValid = await bcrypt.compare(Password_Usuario, user.Password_Usuario);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Generar token
        const token = jwt.sign(
            { userId: user.id, role: user.Role_Usuario},
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
    console.log(req)
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
