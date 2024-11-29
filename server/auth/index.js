const jwt = require('jsonwebtoken');
const config = require('../src/config');

const secret = config.jwt.secret;

function asignarToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1h' });
}

function verificarToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('El token ha expirado');
        }
        throw new Error('Token inválido');
    }
}

function obtenerToken(autorizacion) {
    if (!autorizacion) {
        throw new Error('No se ha enviado un token');
    }

    if (autorizacion.indexOf('Bearer ') === -1) {
        throw new Error('Formato de token incorrecto');
    }

    return autorizacion.replace('Bearer ', '');
}

function decodificarCabecera(req) {
    const autorizacion = req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const decodificado = verificarToken(token);

    req.user = {
        username: decodificado.username,
        password: decodificado.password
    };

    return decodificado;
}

const chequearToken = {
    confirmarToken: function (req) {
        const decodificado = decodificarCabecera(req);
        return decodificado;
    }
};

module.exports = {
    asignarToken,
    chequearToken,
    verificarToken
};