const jwt = require('jsonwebtoken');
const config = require('../src/config');

const secret = config.jwt.secret;

/**
 * Genera un token JWT con los datos proporcionados.
 * @param {Object} data - Datos que se incluirán en el token.
 * @returns {string} Token JWT generado.
 */
function asignarToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1h' });
}

/**
 * Verifica la validez de un token JWT.
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Los datos decodificados del token si es válido.
 * @throws {Error} Si el token ha expirado o es inválido.
 */
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

/**
 * Obtiene el token de autorización desde un encabezado.
 * @param {string} autorizacion - Encabezado de autorización (formato "Bearer <token>").
 * @returns {string} El token extraído del encabezado.
 * @throws {Error} Si no se envía un token o si el formato es incorrecto.
 */
function obtenerToken(autorizacion) {
    if (!autorizacion) {
        throw new Error('No se ha enviado un token');
    }

    if (autorizacion.indexOf('Bearer ') === -1) {
        throw new Error('Formato de token incorrecto');
    }

    return autorizacion.replace('Bearer ', '');
}

/**
 * Decodifica el token JWT presente en los encabezados de la solicitud.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @returns {Object} Datos decodificados del token.
 * @throws {Error} Si no se puede obtener o verificar el token.
 */
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

/**
 * Objeto que contiene métodos relacionados con la verificación de tokens.
 */
const chequearToken = {
    /**
     * Verifica y decodifica el token presente en los encabezados de la solicitud.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @returns {Object} Datos decodificados del token.
     */
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
