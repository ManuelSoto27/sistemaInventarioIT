const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.log("no se encontro un token")
        return res.status(403).json({ error: 'Token requerido' });

    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        console.log("Token validado exitosamente!")
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
        console.log("token invalido")
    }
};

exports.verifyRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
};
